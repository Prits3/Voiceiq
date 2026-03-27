from typing import Optional

from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

from app.core.config import settings


class TwilioService:
    def __init__(self):
        self.client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        self.from_number = settings.TWILIO_PHONE_NUMBER
        self.base_url = settings.BASE_URL

    def make_call(
        self,
        to: str,
        webhook_url: str,
        status_callback_url: Optional[str] = None,
        record: bool = True,
    ):
        """Initiate an outbound call and return the Twilio Call resource."""
        kwargs = {
            "to": to,
            "from_": self.from_number,
            "url": f"{self.base_url}{webhook_url}",
            "record": record,
        }
        if status_callback_url:
            kwargs["status_callback"] = f"{self.base_url}{status_callback_url}"
            kwargs["status_callback_method"] = "POST"
            kwargs["status_callback_event"] = ["completed", "failed", "busy", "no-answer"]

        return self.client.calls.create(**kwargs)

    def cancel_call(self, call_sid: str):
        """Cancel a call that hasn't connected yet, or hang up an active call."""
        try:
            call = self.client.calls(call_sid).fetch()
            if call.status in ("queued", "ringing"):
                self.client.calls(call_sid).update(status="canceled")
            elif call.status == "in-progress":
                self.client.calls(call_sid).update(status="completed")
        except TwilioRestException as exc:
            raise RuntimeError(f"Twilio error canceling call {call_sid}: {exc}") from exc

    def get_call(self, call_sid: str):
        """Fetch a Twilio call resource by SID."""
        return self.client.calls(call_sid).fetch()

    def list_available_numbers(self, area_code: Optional[str] = None, country: str = "US"):
        """Search for available Twilio phone numbers."""
        search_kwargs = {"limit": 20}
        if area_code:
            search_kwargs["area_code"] = area_code
        return self.client.available_phone_numbers(country).local.list(**search_kwargs)

    def purchase_number(self, phone_number: str):
        """Purchase a Twilio phone number."""
        return self.client.incoming_phone_numbers.create(phone_number=phone_number)

    def release_number(self, twilio_sid: str):
        """Release (delete) a Twilio phone number."""
        self.client.incoming_phone_numbers(twilio_sid).delete()
