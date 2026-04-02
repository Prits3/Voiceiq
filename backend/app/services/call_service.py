from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.call import Call, CallStatus
from app.models.campaign import Campaign
from app.models.lead import Lead, LeadStatus


def _use_vapi() -> bool:
    return bool(getattr(settings, "VAPI_API_KEY", ""))


class CallService:
    def __init__(self, db: Session):
        self.db = db

    def initiate_call(self, lead: Lead, campaign: Campaign) -> Call:
        """Create a Call record and dial out via Vapi (or Twilio as fallback)."""
        call = Call(
            lead_id=lead.id,
            campaign_id=campaign.id,
            status=CallStatus.pending,
        )
        self.db.add(call)
        self.db.commit()
        self.db.refresh(call)

        try:
            if _use_vapi():
                call = self._initiate_vapi(call, lead, campaign)
            else:
                call = self._initiate_twilio(call, lead, campaign)
        except Exception as exc:
            call.status = CallStatus.failed
            self.db.commit()
            self.db.refresh(call)
            raise RuntimeError(f"Failed to initiate call: {exc}") from exc

        return call

    def _initiate_vapi(self, call: Call, lead: Lead, campaign: Campaign) -> Call:
        import asyncio
        from app.services.vapi_service import VapiService

        vapi = VapiService()

        # Resolve voice settings from campaign's voice profile (if any)
        voice_id = None
        voice_provider = "11labs"
        voice_settings = None
        if campaign.voice_profile:
            vp = campaign.voice_profile
            voice_id = vp.voice_id
            voice_provider = "openai" if vp.provider == "openai" else "11labs"
            voice_settings = vp.settings

        vapi_call = asyncio.get_event_loop().run_until_complete(
            vapi.make_call(
                to=lead.phone_number,
                campaign_script=campaign.script or "",
                lead_first_name=lead.first_name or "",
                voice_id=voice_id,
                voice_provider=voice_provider,
                voice_settings=voice_settings,
                metadata={"call_id": call.id, "campaign_id": campaign.id},
            )
        )

        # Store Vapi call ID in twilio_call_sid column (same semantic purpose)
        call.twilio_call_sid = vapi_call.get("id")
        call.status = CallStatus.in_progress
        lead.status = LeadStatus.called
        self.db.commit()
        self.db.refresh(call)
        return call

    def _initiate_twilio(self, call: Call, lead: Lead, campaign: Campaign) -> Call:
        from app.services.twilio_service import TwilioService

        twilio = TwilioService()
        twilio_call = twilio.make_call(
            to=lead.phone_number,
            webhook_url=f"/webhook/voice/outbound?call_id={call.id}",
            status_callback_url="/webhook/voice/status",
        )
        call.twilio_call_sid = twilio_call.sid
        call.status = CallStatus.in_progress
        lead.status = LeadStatus.called
        self.db.commit()
        self.db.refresh(call)
        return call

    def stop_call(self, call: Call) -> Call:
        """Cancel or hang up an active call."""
        if call.twilio_call_sid:
            try:
                if _use_vapi():
                    import asyncio
                    from app.services.vapi_service import VapiService
                    vapi = VapiService()
                    asyncio.get_event_loop().run_until_complete(
                        vapi.stop_call(call.twilio_call_sid)
                    )
                else:
                    from app.services.twilio_service import TwilioService
                    TwilioService().cancel_call(call.twilio_call_sid)
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
