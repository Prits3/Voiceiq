from sqlalchemy.orm import Session

from app.models.call import Call, CallStatus
from app.models.campaign import Campaign
from app.models.lead import Lead, LeadStatus
from app.services.twilio_service import TwilioService


class CallService:
    def __init__(self, db: Session):
        self.db = db
        self.twilio = TwilioService()

    def initiate_call(self, lead: Lead, campaign: Campaign) -> Call:
        """Create a Call record and dial out via Twilio."""
        # Create call record first
        call = Call(
            lead_id=lead.id,
            campaign_id=campaign.id,
            status=CallStatus.pending,
        )
        self.db.add(call)
        self.db.commit()
        self.db.refresh(call)

        try:
            twilio_call = self.twilio.make_call(
                to=lead.phone_number,
                webhook_url=f"/webhook/voice/outbound?call_id={call.id}",
                status_callback_url="/webhook/voice/status",
            )
            call.twilio_call_sid = twilio_call.sid
            call.status = CallStatus.in_progress
            lead.status = LeadStatus.called
            self.db.commit()
            self.db.refresh(call)
        except Exception as exc:
            call.status = CallStatus.failed
            self.db.commit()
            self.db.refresh(call)
            raise RuntimeError(f"Failed to initiate call: {exc}") from exc

        return call

    def stop_call(self, call: Call) -> Call:
        """Cancel or hang up an active call."""
        if call.twilio_call_sid:
            try:
                self.twilio.cancel_call(call.twilio_call_sid)
            except Exception:
                pass  # best-effort

        call.status = CallStatus.failed
        self.db.commit()
        self.db.refresh(call)
        return call

    def update_call_outcome(
        self,
        call_id: int,
        status: CallStatus,
        duration: float = None,
        recording_url: str = None,
        transcript: str = None,
    ) -> Call:
        call = self.db.query(Call).filter(Call.id == call_id).first()
        if not call:
            raise ValueError(f"Call {call_id} not found")
        call.status = status
        if duration is not None:
            call.duration = duration
        if recording_url:
            call.recording_url = recording_url
        if transcript:
            call.transcript = transcript
        self.db.commit()
        self.db.refresh(call)
        return call
