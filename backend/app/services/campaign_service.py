from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.campaign import Campaign, CampaignStatus
from app.models.call import Call, CallStatus
from app.models.lead import Lead, LeadStatus


class CampaignService:
    def __init__(self, db: Session):
        self.db = db

    def get_campaign_stats(self, campaign_id: int) -> dict:
        """Return aggregate stats for a campaign."""
        total_leads = (
            self.db.query(Lead).filter(Lead.campaign_id == campaign_id).count()
        )
        pending_leads = (
            self.db.query(Lead)
            .filter(Lead.campaign_id == campaign_id, Lead.status == LeadStatus.pending)
            .count()
        )
        converted_leads = (
            self.db.query(Lead)
            .filter(Lead.campaign_id == campaign_id, Lead.status == LeadStatus.converted)
            .count()
        )
        total_calls = (
            self.db.query(Call).filter(Call.campaign_id == campaign_id).count()
        )
        completed_calls = (
            self.db.query(Call)
            .filter(Call.campaign_id == campaign_id, Call.status == CallStatus.completed)
            .count()
        )
        failed_calls = (
            self.db.query(Call)
            .filter(Call.campaign_id == campaign_id, Call.status == CallStatus.failed)
            .count()
        )

        conversion_rate = (converted_leads / total_leads * 100) if total_leads > 0 else 0.0

        return {
            "total_leads": total_leads,
            "pending_leads": pending_leads,
            "converted_leads": converted_leads,
            "total_calls": total_calls,
            "completed_calls": completed_calls,
            "failed_calls": failed_calls,
            "conversion_rate": round(conversion_rate, 2),
        }

    def activate_campaign(self, campaign: Campaign) -> Campaign:
        """Set campaign to active status."""
        campaign.status = CampaignStatus.active
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def pause_campaign(self, campaign: Campaign) -> Campaign:
        """Pause an active campaign."""
        if campaign.status != CampaignStatus.active:
            raise ValueError("Only active campaigns can be paused")
        campaign.status = CampaignStatus.paused
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def complete_campaign(self, campaign: Campaign) -> Campaign:
        """Mark a campaign as completed."""
        campaign.status = CampaignStatus.completed
        self.db.commit()
        self.db.refresh(campaign)
        return campaign

    def get_next_leads_to_call(self, campaign_id: int, batch_size: int = 10) -> List[Lead]:
        """Return the next batch of pending leads for calling."""
        return (
            self.db.query(Lead)
            .filter(
                Lead.campaign_id == campaign_id,
                Lead.status == LeadStatus.pending,
            )
            .limit(batch_size)
            .all()
        )
