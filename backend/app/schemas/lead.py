from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.lead import LeadStatus


class LeadBase(BaseModel):
    first_name: str
    last_name: Optional[str] = None
    phone_number: str
    email: Optional[str] = None
    status: LeadStatus = LeadStatus.pending


class LeadCreate(LeadBase):
    campaign_id: int


class LeadUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    status: Optional[LeadStatus] = None


class LeadResponse(LeadBase):
    id: int
    campaign_id: int
    created_at: datetime

    class Config:
        from_attributes = True
