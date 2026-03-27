import httpx
import openai

from app.core.config import settings


class TTSService:
    """Text-to-speech service supporting ElevenLabs and OpenAI TTS."""

    async def synthesize(
        self,
        text: str,
        provider: str = "openai",
        voice_id: str = "alloy",
        voice_settings: dict = None,
    ) -> bytes:
        """Convert text to speech audio. Returns raw audio bytes (mp3)."""
        if provider == "elevenlabs":
            return await self._elevenlabs_tts(text, voice_id, voice_settings or {})
        return await self._openai_tts(text, voice_id)

    async def _openai_tts(self, text: str, voice: str = "alloy") -> bytes:
        """Use OpenAI TTS API to generate speech."""
        valid_voices = {"alloy", "echo", "fable", "onyx", "nova", "shimmer"}
        if voice not in valid_voices:
            voice = "alloy"

        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        response = await client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            response_format="mp3",
        )
        return response.content

    async def _elevenlabs_tts(
        self, text: str, voice_id: str, settings_overrides: dict = None
    ) -> bytes:
        """Use ElevenLabs API to generate speech."""
        api_key = getattr(settings, "ELEVENLABS_API_KEY", "")
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75,
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
        """Fetch available voices from ElevenLabs."""
        api_key = getattr(settings, "ELEVENLABS_API_KEY", "")
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={"xi-api-key": api_key},
                timeout=15.0,
            )
            response.raise_for_status()
            data = response.json()
            return data.get("voices", [])
