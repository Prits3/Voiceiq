import os
import re

from fastapi import APIRouter, Depends, Form, Request, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from twilio.twiml.voice_response import Gather, VoiceResponse

from app.core.config import settings
from app.core.database import get_db
from app.models.call import Call
from app.models.call import CallStatus as CallStatusEnum
from app.services.ai_agent_service import AIAgentService
from app.services.tts_service import tts_service

router = APIRouter(prefix="/webhook", tags=["webhook"])

# Safe filename pattern: 32 hex chars + .mp3
_SAFE_FILENAME = re.compile(r'^[a-f0-9]{32}\.mp3$')

# Kokoro voice to use for all outbound calls
_CALL_VOICE = "af_heart"


async def _play_or_say(response: VoiceResponse, text: str) -> None:
    """
    Try to generate audio via Kokoro → Azure.
    If both fail, fall back to Twilio <Say> so the call never crashes.
    """
    audio_bytes = await tts_service.synthesize_for_call(text, voice=_CALL_VOICE)
    if audio_bytes:
        filename = await tts_service.save_audio_file(audio_bytes)
        base_url = getattr(settings, "BASE_URL", "").rstrip("/")
        response.play(f"{base_url}/webhook/voice/audio/{filename}")
    else:
        # Last-resort fallback: Twilio built-in Google Neural TTS
        response.say(text, voice="Google.en-US-Journey-F")


async def _play_or_say_in_gather(gather: Gather, text: str) -> None:
    """Same as _play_or_say but appends into a <Gather> block."""
    audio_bytes = await tts_service.synthesize_for_call(text, voice=_CALL_VOICE)
    if audio_bytes:
        filename = await tts_service.save_audio_file(audio_bytes)
        base_url = getattr(settings, "BASE_URL", "").rstrip("/")
        gather.play(f"{base_url}/webhook/voice/audio/{filename}")
    else:
        gather.say(text, voice="Google.en-US-Journey-F")


# ------------------------------------------------------------------ #
#  Audio file serving                                                  #
# ------------------------------------------------------------------ #

@router.get("/voice/audio/{filename}")
async def serve_audio(filename: str):
    """Serve a generated MP3 file to Twilio. Validates filename to prevent path traversal."""
    if not _SAFE_FILENAME.match(filename):
        return Response(content="not found", status_code=404)
    path = f"/tmp/{filename}"
    if not os.path.exists(path):
        return Response(content="not found", status_code=404)
    return FileResponse(path, media_type="audio/mpeg")


# ------------------------------------------------------------------ #
#  Twilio voice webhooks                                               #
# ------------------------------------------------------------------ #

@router.post("/voice/incoming")
async def handle_incoming_call(
    request: Request,
    CallSid: str = Form(...),
    From: str = Form(...),
    To: str = Form(...),
    db: Session = Depends(get_db),
):
    """Handle incoming Twilio voice call webhook."""
    response = VoiceResponse()
    gather = Gather(
        input="speech",
        action="/webhook/voice/gather",
        method="POST",
        speech_timeout="auto",
        language="en-US",
    )
    await _play_or_say_in_gather(gather, "Hello! Thank you for calling. How can I help you today?")
    response.append(gather)
    await _play_or_say(response, "We didn't receive any input. Goodbye!")
    return Response(content=str(response), media_type="application/xml")


@router.post("/voice/outbound")
async def handle_outbound_call(
    request: Request,
    CallSid: str = Form(...),
    CallStatus: str = Form(None),
    db: Session = Depends(get_db),
):
    """Handle outbound Twilio voice call — deliver the campaign script."""
    call = db.query(Call).filter(Call.twilio_call_sid == CallSid).first()

    response = VoiceResponse()

    if call and call.campaign and call.campaign.script:
        script_text = call.campaign.script
    else:
        script_text = "Hello! This is an automated call. We'll get back to you shortly. Goodbye."

    gather = Gather(
        input="speech",
        action=f"/webhook/voice/gather?call_id={call.id if call else ''}",
        method="POST",
        speech_timeout="auto",
        language="en-US",
    )
    await _play_or_say_in_gather(gather, script_text)
    response.append(gather)
    await _play_or_say(response, "Thank you for your time. Goodbye!")
    response.hangup()

    return Response(content=str(response), media_type="application/xml")


@router.post("/voice/gather")
async def handle_gather(
    request: Request,
    SpeechResult: str = Form(None),
    CallSid: str = Form(...),
    call_id: int = None,
    db: Session = Depends(get_db),
):
    """Handle speech input gathered during a call."""
    response = VoiceResponse()

    if not SpeechResult:
        await _play_or_say(response, "I'm sorry, I didn't catch that. Goodbye!")
        response.hangup()
        return Response(content=str(response), media_type="application/xml")

    call = db.query(Call).filter(Call.twilio_call_sid == CallSid).first()
    if call and call.campaign:
        ai_service = AIAgentService()
        ai_response = await ai_service.generate_response(
            user_input=SpeechResult,
            campaign_script=call.campaign.script or "",
        )
        existing_transcript = call.transcript or ""
        call.transcript = (
            existing_transcript
            + f"\nProspect: {SpeechResult}\nAgent: {ai_response}"
        )
        db.commit()
        reply_text = ai_response
    else:
        reply_text = "Thank you for your response. We'll follow up with you soon. Goodbye!"

    await _play_or_say(response, reply_text)
    response.hangup()
    return Response(content=str(response), media_type="application/xml")


@router.post("/voice/status")
async def handle_call_status(
    CallSid: str = Form(...),
    CallStatus: str = Form(...),
    CallDuration: str = Form(None),
    RecordingUrl: str = Form(None),
    db: Session = Depends(get_db),
):
    """Handle Twilio call status callback."""
    call = db.query(Call).filter(Call.twilio_call_sid == CallSid).first()
    if call:
        status_map = {
            "completed": CallStatusEnum.completed,
            "failed": CallStatusEnum.failed,
            "busy": CallStatusEnum.failed,
            "no-answer": CallStatusEnum.failed,
            "canceled": CallStatusEnum.failed,
            "in-progress": CallStatusEnum.in_progress,
        }
        new_status = status_map.get(CallStatus.lower(), call.status)
        call.status = new_status
        if CallDuration:
            call.duration = float(CallDuration)
        if RecordingUrl:
            call.recording_url = RecordingUrl
        db.commit()

    return Response(content="", status_code=204)
