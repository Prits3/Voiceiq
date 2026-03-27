from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.campaign import CampaignStatus


class CampaignBase(BaseModel):
    name: str
    script: Optional[str] = None
    status: CampaignStatus = CampaignStatus.draft


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    script: Optional[str] = None
    status: Optional[CampaignStatus] = None


class CampaignResponse(CampaignBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
