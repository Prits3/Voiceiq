import logging
import os
import re
import time
import uuid
from typing import Optional

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# Simple in-memory index for cleanup: {filepath: created_at}
_tmp_files: dict = {}
_CLEANUP_AFTER_SECONDS = 600  # 10 minutes


def _cleanup_old_files() -> None:
    """Remove /tmp audio files older than 10 minutes."""
    now = time.time()
    stale = [p for p, ts in _tmp_files.items() if now - ts > _CLEANUP_AFTER_SECONDS]
    for path in stale:
        try:
            os.remove(path)
        except FileNotFoundError:
            pass
        _tmp_files.pop(path, None)


class TTSService:
    """
    Text-to-speech service.

    Provider priority for live calls:
      1. Kokoro-Web (self-hosted, free, human-sounding)
      2. Azure Neural TTS (fallback)
      3. None — caller falls back to Twilio <Say> in the webhook

    Existing providers (elevenlabs / openai) are kept for the Voice Profile
    feature in the dashboard and are not part of the call fallback chain.
    """

    # ------------------------------------------------------------------ #
    #  Live-call TTS: Kokoro → Azure → (caller uses <Say> if both fail)  #
    # ------------------------------------------------------------------ #

    async def synthesize_for_call(
        self,
        text: str,
        voice: str = "af_heart",
    ) -> Optional[bytes]:
        """
        Generate MP3 audio for a live call.
        Returns bytes on success, None if all providers fail (use <Say> instead).
        """
        _cleanup_old_files()

        kokoro_url = getattr(settings, "KOKORO_BASE_URL", "")
        if kokoro_url:
            try:
                return await self._kokoro_tts(text, voice)
            except Exception as e:
                logger.warning("Kokoro TTS failed, trying Azure: %s", e)

        azure_key = getattr(settings, "AZURE_SPEECH_KEY", "")
        if azure_key:
            try:
                return await self._azure_tts(text)
            except Exception as e:
                logger.warning("Azure TTS failed, falling back to <Say>: %s", e)

        logger.error("All TTS providers failed — caller should use Twilio <Say>")
        return None

    async def save_audio_file(self, audio_bytes: bytes) -> str:
        """Save MP3 bytes to /tmp and return the unique filename (not path)."""
        filename = f"{uuid.uuid4().hex}.mp3"
        path = f"/tmp/{filename}"
        with open(path, "wb") as f:
            f.write(audio_bytes)
        _tmp_files[path] = time.time()
        return filename

    async def _kokoro_tts(self, text: str, voice: str = "af_heart") -> bytes:
        """Call Kokoro-Web's OpenAI-compatible /audio/speech endpoint."""
        base_url = settings.KOKORO_BASE_URL.rstrip("/")
        api_key = getattr(settings, "KOKORO_API_KEY", "")

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{base_url}/audio/speech",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "model_q8f16",
                    "input": text,
                    "voice": voice,
                    "speed": 1.0,
                    "response_format": "mp3",
                },
            )
            response.raise_for_status()
            return response.content

    async def _azure_tts(
        self,
        text: str,
        voice: str = "en-US-JennyNeural",
    ) -> bytes:
        """Azure Cognitive Services Neural TTS (free tier: 500k chars/month)."""
        key = settings.AZURE_SPEECH_KEY
        region = getattr(settings, "AZURE_SPEECH_REGION", "westeurope")

        ssml = (
            f"<speak version='1.0' xml:lang='en-US'>"
            f"<voice name='{voice}'>{text}</voice>"
            f"</speak>"
        )

        token_url = f"https://{region}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
        tts_url = f"https://{region}.tts.speech.microsoft.com/cognitiveservices/v1"

        async with httpx.AsyncClient(timeout=15.0) as client:
            token_resp = await client.post(
                token_url,
                headers={"Ocp-Apim-Subscription-Key": key},
            )
            token_resp.raise_for_status()

            audio_resp = await client.post(
                tts_url,
                headers={
                    "Authorization": f"Bearer {token_resp.text}",
                    "Content-Type": "application/ssml+xml",
                    "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
                    "User-Agent": "VoiceIQ",
                },
                content=ssml.encode("utf-8"),
            )
            audio_resp.raise_for_status()
            return audio_resp.content

    # ------------------------------------------------------------------ #
    #  Dashboard / Voice Profile TTS (ElevenLabs + OpenAI)               #
    # ------------------------------------------------------------------ #

    async def synthesize(
        self,
        text: str,
        provider: str = "openai",
        voice_id: str = "nova",
        voice_settings: dict = None,
    ) -> bytes:
        """Convert text to speech for Voice Profile previews. Returns MP3 bytes."""
        if provider == "elevenlabs":
            return await self._elevenlabs_tts(text, voice_id, voice_settings or {})
        return await self._openai_tts(text, voice_id)

    async def _openai_tts(self, text: str, voice: str = "nova") -> bytes:
        import openai as _openai
        valid_voices = {"alloy", "echo", "fable", "onyx", "nova", "shimmer"}
        if voice not in valid_voices:
            voice = "nova"
        client = _openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.audio.speech.create(
            model="tts-1-hd",
            voice=voice,
            input=text,
            response_format="mp3",
        )
        return response.content

    async def _elevenlabs_tts(
        self, text: str, voice_id: str, settings_overrides: dict = None
    ) -> bytes:
        api_key = getattr(settings, "ELEVENLABS_API_KEY", "")
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        payload = {
            "text": text,
            "model_id": "eleven_turbo_v2_5",
            "voice_settings": {
                "stability": 0.30,
                "similarity_boost": 0.85,
                "style": 0.45,
                "use_speaker_boost": True,
                **(settings_overrides or {}),
            },
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json=payload,
                headers={
                    "xi-api-key": api_key,
                    "Content-Type": "application/json",
                    "Accept": "audio/mpeg",
                },
                timeout=30.0,
            )
            response.raise_for_status()
            return response.content

    async def list_elevenlabs_voices(self) -> list:
        api_key = getattr(settings, "ELEVENLABS_API_KEY", "")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={"xi-api-key": api_key},
                timeout=15.0,
            )
            response.raise_for_status()
            return response.json().get("voices", [])


# Singleton
tts_service = TTSService()
