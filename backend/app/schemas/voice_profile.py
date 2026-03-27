from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel

from app.models.voice_profile import VoiceProvider


class VoiceProfileBase(BaseModel):
    name: str
    provider: VoiceProvider
    voice_id: str
    settings: Optional[Dict[str, Any]] = None


class VoiceProfileCreate(VoiceProfileBase):
    pass


class VoiceProfileUpdate(BaseModel):
    name: Optional[str] = None
    provider: Optional[VoiceProvider] = None
    voice_id: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None


class VoiceProfileResponse(VoiceProfileBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
