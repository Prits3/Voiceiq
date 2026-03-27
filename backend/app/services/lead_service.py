import csv
import io
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.lead import Lead, LeadStatus
from app.utils.helpers import format_phone_e164


class LeadService:
    def __init__(self, db: Session):
        self.db = db

    def import_from_csv(self, campaign_id: int, csv_content: str) -> List[Lead]:
        """Parse a CSV string and bulk-insert leads for the given campaign.

        Expected CSV columns (case-insensitive):
            first_name, last_name (optional), phone_number, email (optional)
        """
        reader = csv.DictReader(io.StringIO(csv_content))
        fieldnames_lower = {f.lower(): f for f in (reader.fieldnames or [])}

        def get_col(row: dict, key: str) -> Optional[str]:
            original = fieldnames_lower.get(key)
            if original and original in row:
                return row[original].strip() or None
            return None

        leads: List[Lead] = []
        for row in reader:
            phone_raw = get_col(row, "phone_number") or get_col(row, "phone")
            first_name = get_col(row, "first_name") or get_col(row, "firstname")
            if not phone_raw or not first_name:
                continue  # skip rows missing required fields

            formatted_phone = format_phone_e164(phone_raw)
            lead = Lead(
                campaign_id=campaign_id,
                first_name=first_name,
                last_name=get_col(row, "last_name") or get_col(row, "lastname"),
                phone_number=formatted_phone,
                email=get_col(row, "email"),
            )
            self.db.add(lead)
            leads.append(lead)

        self.db.commit()
        for lead in leads:
            self.db.refresh(lead)
        return leads

    def mark_as_converted(self, lead_id: int) -> Optional[Lead]:
        lead = self.db.query(Lead).filter(Lead.id == lead_id).first()
        if lead:
            lead.status = LeadStatus.converted
            self.db.commit()
            self.db.refresh(lead)
        return lead

    def mark_do_not_call(self, lead_id: int) -> Optional[Lead]:
        lead = self.db.query(Lead).filter(Lead.id == lead_id).first()
        if lead:
            lead.status = LeadStatus.do_not_call
            self.db.commit()
            self.db.refresh(lead)
        return lead

    def get_callable_leads(self, campaign_id: int, limit: int = 50) -> List[Lead]:
        """Return leads that are pending and eligible to be called."""
        return (
            self.db.query(Lead)
            .filter(
                Lead.campaign_id == campaign_id,
                Lead.status == LeadStatus.pending,
            )
            .limit(limit)
            .all()
        )
