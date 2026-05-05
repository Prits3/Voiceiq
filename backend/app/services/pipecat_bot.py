"""
Pipecat voice bot — compatible with pipecat-ai 0.0.108 (Python 3.11+).

Pipeline: Twilio audio → Groq Whisper (STT) → Groq LLaMA (LLM) → Cartesia (TTS) → Twilio audio
"""
from loguru import logger

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.openai_llm_context import OpenAILLMContext
from pipecat.serializers.twilio import TwilioFrameSerializer
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.groq.llm import GroqLLMService
from pipecat.services.groq.stt import GroqSTTService
from pipecat.transports.websocket.fastapi import (
    FastAPIWebsocketParams,
    FastAPIWebsocketTransport,
)

from app.core.config import settings

# Default Cartesia voice: "Barbra" — clear, warm, neutral English
DEFAULT_CARTESIA_VOICE = "a0e99841-438c-4a64-b679-ae501e7d6091"


async def run_pipecat_bot(
    websocket,
    stream_sid: str,
    call_sid: str,
    lead_name: str,
    campaign_script: str,
    voice: str = DEFAULT_CARTESIA_VOICE,
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

    tts = CartesiaTTSService(
        api_key=settings.CARTESIA_API_KEY,
        voice_id=voice,
        model="sonic-2",
        sample_rate=8_000,  # match Twilio's 8kHz μ-law
    )

    system_prompt = (
        f"You are Alex, a warm and friendly AI sales rep calling {lead_name or 'a prospect'}. "
        f"Your goal:\n{campaign_script}\n\n"
        "Rules:\n"
        "- Sound like a real human: use contractions, be conversational, never robotic\n"
        "- Max 1-2 short sentences per response — this is a phone call\n"
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
