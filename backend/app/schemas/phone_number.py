from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class PhoneNumberBase(BaseModel):
    number: str
    twilio_sid: Optional[str] = None
    is_active: bool = True


class PhoneNumberCreate(PhoneNumberBase):
    pass


class PhoneNumberResponse(PhoneNumberBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
