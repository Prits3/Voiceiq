from fastapi import APIRouter, Depends, Form, Request, Response
from sqlalchemy.orm import Session
from twilio.twiml.voice_response import Gather, VoiceResponse

from app.core.database import get_db
from app.models.call import Call, CallStatus
from app.services.ai_agent_service import AIAgentService
from app.services.tts_service import TTSService

router = APIRouter(prefix="/webhook", tags=["webhook"])


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
    gather.say(
        "Hello! Thank you for calling. How can I help you today?",
        voice="Polly.Joanna",
    )
    response.append(gather)
    response.say("We didn't receive any input. Goodbye!")
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
    gather.say(script_text, voice="Polly.Joanna")
    response.append(gather)
    response.say("Thank you for your time. Goodbye!")
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
        response.say("I'm sorry, I didn't catch that. Goodbye!")
        response.hangup()
        return Response(content=str(response), media_type="application/xml")

    # Use AI agent to generate a response based on speech input
    call = db.query(Call).filter(Call.twilio_call_sid == CallSid).first()
    if call and call.campaign:
        ai_service = AIAgentService()
        ai_response = await ai_service.generate_response(
            user_input=SpeechResult,
            campaign_script=call.campaign.script or "",
        )
        # Update transcript
        existing_transcript = call.transcript or ""
        call.transcript = (
            existing_transcript
            + f"\nProspect: {SpeechResult}\nAgent: {ai_response}"
        )
        db.commit()
        reply_text = ai_response
    else:
        reply_text = "Thank you for your response. We'll follow up with you soon. Goodbye!"

    response.say(reply_text, voice="Polly.Joanna")
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
            "completed": CallStatus.completed,
            "failed": CallStatus.failed,
            "busy": CallStatus.failed,
            "no-answer": CallStatus.failed,
            "canceled": CallStatus.failed,
            "in-progress": CallStatus.in_progress,
        }
        new_status = status_map.get(CallStatus.lower(), call.status)
        call.status = new_status
        if CallDuration:
            call.duration = float(CallDuration)
        if RecordingUrl:
            call.recording_url = RecordingUrl
        db.commit()

    return Response(content="", status_code=204)
