import io
from typing import Optional

import httpx
import openai

from app.core.config import settings


class STTService:
    """Speech-to-text service supporting OpenAI Whisper and Deepgram."""

    async def transcribe(
        self,
        audio_bytes: bytes,
        provider: str = "whisper",
        filename: str = "audio.wav",
        language: Optional[str] = None,
    ) -> str:
        """Transcribe audio bytes to text."""
        if provider == "deepgram":
            return await self._deepgram_transcribe(audio_bytes, language)
        return await self._whisper_transcribe(audio_bytes, filename, language)

    async def _whisper_transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "audio.wav",
        language: Optional[str] = None,
    ) -> str:
        """Use OpenAI Whisper for transcription."""
        client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = filename

        kwargs = {"model": "whisper-1", "file": audio_file}
        if language:
            kwargs["language"] = language

        response = await client.audio.transcriptions.create(**kwargs)
        return response.text

    async def _deepgram_transcribe(
        self, audio_bytes: bytes, language: Optional[str] = None
    ) -> str:
        """Use Deepgram Nova-2 for transcription."""
        api_key = getattr(settings, "DEEPGRAM_API_KEY", "")
        params = {
            "model": "nova-2",
            "smart_format": "true",
            "punctuate": "true",
        }
        if language:
            params["language"] = language

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.deepgram.com/v1/listen",
                content=audio_bytes,
                params=params,
                headers={
                    "Authorization": f"Token {api_key}",
                    "Content-Type": "audio/wav",
                },
                timeout=30.0,
            )
            response.raise_for_status()
            data = response.json()
            try:
                return (
                    data["results"]["channels"][0]["alternatives"][0]["transcript"]
                )
            except (KeyError, IndexError):
                return ""

    async def transcribe_from_url(self, audio_url: str) -> str:
        """Download audio from a URL and transcribe it."""
        async with httpx.AsyncClient() as client:
            resp = await client.get(audio_url, timeout=30.0)
            resp.raise_for_status()
            audio_bytes = resp.content
        return await self.transcribe(audio_bytes)
