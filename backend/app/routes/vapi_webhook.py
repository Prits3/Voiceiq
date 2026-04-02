from typing import Optional

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.call import Call, CallStatus

router = APIRouter(prefix="/webhook/vapi", tags=["vapi-webhook"])


def _parse_ended_reason(reason: Optional[str]) -> CallStatus:
    failed_reasons = {
        "error",
        "assistant-error",
        "phone-call-provider-bypass-enabled-but-no-call-received",
        "twilio-failed-to-connect-call",
        "voicemail",
        "no-answer",
        "busy",
        "failed",
    }
    if reason and any(r in reason.lower() for r in failed_reasons):
        return CallStatus.failed
    return CallStatus.completed


@router.post("/events")
async def handle_vapi_event(request: Request, db: Session = Depends(get_db)):
    """Receive all Vapi webhook events."""
    try:
        body = await request.json()
    except Exception:
        return Response(content="invalid json", status_code=400)

    # Vapi wraps events inside a "message" key
    message = body.get("message", body)
    event_type = message.get("type", "")

    if event_type == "end-of-call-report":
        await _handle_call_ended(message, db)

    return Response(content="ok", status_code=200)


async def _handle_call_ended(message: dict, db: Session):
    call_data = message.get("call", {})
    vapi_call_id = call_data.get("id")
    if not vapi_call_id:
        return

    call = db.query(Call).filter(Call.twilio_call_sid == vapi_call_id).first()
    if not call:
        return

    ended_reason = call_data.get("endedReason") or message.get("endedReason")
    call.status = _parse_ended_reason(ended_reason)

    # Duration
    duration = (
        message.get("durationSeconds")
        or call_data.get("endedAt") and _calc_duration(call_data)
    )
    if duration:
        call.duration = float(duration)

    # Transcript
    transcript = message.get("transcript") or call_data.get("transcript")
    if transcript:
        call.transcript = transcript

    # Recording
    artifact = message.get("artifact", {})
    recording_url = artifact.get("recordingUrl") or call_data.get("recordingUrl")
    if recording_url:
        call.recording_url = recording_url

    db.commit()


def _calc_duration(call_data: dict) -> Optional[float]:
    """Approximate duration from ISO timestamps when durationSeconds isn't provided."""
    from datetime import datetime, timezone
    started = call_data.get("startedAt")
    ended = call_data.get("endedAt")
    if not started or not ended:
        return None
    try:
        fmt = "%Y-%m-%dT%H:%M:%S.%fZ"
        s = datetime.strptime(started, fmt).replace(tzinfo=timezone.utc)
        e = datetime.strptime(ended, fmt).replace(tzinfo=timezone.utc)
        return (e - s).total_seconds()
    except Exception:
        return None
