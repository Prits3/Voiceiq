"""
Pipecat voice bot for outbound sales calls.

Pipeline: Twilio audio → Groq Whisper (STT) → Groq LLaMA (LLM) → Kokoro (TTS) → Twilio audio

Uses only services already configured:
  - settings.GROQ_API_KEY / GROQ_MODEL / GROQ_STT_MODEL
  - settings.KOKORO_BASE_URL / KOKORO_API_KEY
"""
import asyncio
import struct
from typing import AsyncGenerator

import httpx
from loguru import logger
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import (
    AudioRawFrame,
    EndFrame,
    Frame,
    LLMRunFrame,
    TTSStartedFrame,
    TTSStoppedFrame,
)
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.serializers.twilio import TwilioFrameSerializer
from pipecat.services.ai_services import TTSService
from pipecat.services.groq import GroqLLMService, GroqSTTService
from pipecat.transports.websocket.fastapi import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)

from app.core.config import settings


# ── Custom Kokoro TTS ────────────────────────────────────────────────────────


class KokoroTTSService(TTSService):
    """Calls Kokoro-Web's OpenAI-compatible /audio/speech endpoint.
    Returns raw 16-bit PCM at 24 kHz; Pipecat resamples to 8 kHz for Twilio.
    """

    def __init__(self, voice: str = "af_heart"):
        super().__init__(sample_rate=24_000)
        self._voice = voice
        self._base_url = settings.KOKORO_BASE_URL.rstrip("/")
        self._api_key = settings.KOKORO_API_KEY

    async def run_tts(self, text: str) -> AsyncGenerator[Frame, None]:
        logger.debug(f"[Kokoro TTS] synthesizing: {text[:60]}")
        yield TTSStartedFrame()
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                resp = await client.post(
                    f"{self._base_url}/audio/speech",
                    headers={
                        "Authorization": f"Bearer {self._api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": "model_q8f16",
                        "input": text,
                        "voice": self._voice,
                        "response_format": "pcm",   # raw 16-bit signed LE PCM
                        "speed": 1.0,
                    },
                )
                resp.raise_for_status()
                pcm_bytes = resp.content

            # Yield in ~20 ms chunks (24000 Hz × 2 bytes × 0.02 s = 960 bytes)
            chunk_size = 960
            for i in range(0, len(pcm_bytes), chunk_size):
                yield AudioRawFrame(
                    audio=pcm_bytes[i : i + chunk_size],
                    sample_rate=24_000,
                    num_channels=1,
                )
        except Exception as exc:
            logger.error(f"[Kokoro TTS] failed: {exc}")
        finally:
            yield TTSStoppedFrame()


# ── Bot entry point ──────────────────────────────────────────────────────────


async def run_pipecat_bot(
    websocket,
    stream_sid: str,
    call_sid: str,
    lead_name: str,
    campaign_script: str,
    voice: str = "af_heart",
):
    """Start a Pipecat pipeline connected to a Twilio Media Stream WebSocket."""

    serializer = TwilioFrameSerializer(
        stream_sid=stream_sid,
        call_sid=call_sid,
        account_sid=settings.TWILIO_ACCOUNT_SID,
        auth_token=settings.TWILIO_AUTH_TOKEN,
    )

    transport = FastAPIWebsocketTransport(
        websocket=websocket,
        params=FastAPIWebsocketParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            add_wav_header=False,
            vad_analyzer=SileroVADAnalyzer(),
            serializer=serializer,
        ),
    )

    stt = GroqSTTService(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_STT_MODEL,
    )

    llm = GroqLLMService(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
    )

    tts = KokoroTTSService(voice=voice)

    system_prompt = (
        f"You are Alex, a warm and friendly AI sales rep calling {lead_name or 'a prospect'}. "
        f"Your goal:\n{campaign_script}\n\n"
        "Rules:\n"
        "- Sound like a real human: use contractions, be conversational, never robotic\n"
        "- Max 1–2 short sentences per response — this is a phone call\n"
        "- Handle objections with empathy, pivot to value\n"
        "- Guide toward a demo or follow-up call as the next step\n"
        "- Never admit to being an AI unless directly asked"
    )

    messages = [{"role": "system", "content": system_prompt}]
    context = OpenAILLMContext(messages)
    context_aggregator = llm.create_context_aggregator(context)

    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            context_aggregator.user(),
            llm,
            tts,
            transport.output(),
            context_aggregator.assistant(),
        ]
    )

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            audio_in_sample_rate=8_000,
            audio_out_sample_rate=8_000,
            enable_metrics=False,
        ),
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info("[Pipecat] client connected — kicking off greeting")
        messages.append(
            {
                "role": "system",
                "content": (
                    f"Say a warm, natural opening line to {lead_name or 'the prospect'}. "
                    "Max 2 sentences. Sound like a real person, not a bot."
                ),
            }
        )
        await task.queue_frame(LLMRunFrame())

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info("[Pipecat] client disconnected")
        await task.cancel()

    runner = PipelineRunner(handle_sigint=False)
    await runner.run(task)
