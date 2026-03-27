from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.call import CallStatus


class CallBase(BaseModel):
    lead_id: int
    campaign_id: int
    status: CallStatus = CallStatus.pending


class CallCreate(CallBase):
    pass


class CallResponse(CallBase):
    id: int
    duration: Optional[float] = None
    recording_url: Optional[str] = None
    transcript: Optional[str] = None
    twilio_call_sid: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
