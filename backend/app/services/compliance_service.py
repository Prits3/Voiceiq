import re
from datetime import datetime, time
from typing import List, Optional, Set

from sqlalchemy.orm import Session

from app.models.lead import Lead, LeadStatus
from app.utils.helpers import format_phone_e164


# Simple in-memory DNC list (in production this should be persisted / integrated with
# a real DNC registry API such as the FTC's National Do Not Call Registry).
_internal_dnc: Set[str] = set()


class ComplianceService:
    """TCPA compliance checks and Do-Not-Call list validation."""

    # TCPA safe calling hours (8 AM – 9 PM local time)
    CALL_START_HOUR = 8
    CALL_END_HOUR = 21

    def __init__(self, db: Optional[Session] = None):
        self.db = db

    # ------------------------------------------------------------------
    # Do-Not-Call checks
    # ------------------------------------------------------------------

    def add_to_dnc(self, phone_number: str) -> None:
        """Add a phone number to the internal DNC list."""
        normalized = format_phone_e164(phone_number)
        _internal_dnc.add(normalized)

    def remove_from_dnc(self, phone_number: str) -> None:
        normalized = format_phone_e164(phone_number)
        _internal_dnc.discard(normalized)

    def is_on_dnc(self, phone_number: str) -> bool:
        """Return True if the number is on the internal DNC list."""
        normalized = format_phone_e164(phone_number)
        return normalized in _internal_dnc

    def bulk_add_to_dnc(self, phone_numbers: List[str]) -> int:
        """Add multiple numbers to DNC list. Returns count added."""
        count = 0
        for number in phone_numbers:
            normalized = format_phone_e164(number)
            if normalized and normalized not in _internal_dnc:
                _internal_dnc.add(normalized)
                count += 1
        return count

    # ------------------------------------------------------------------
    # TCPA time-of-day checks
    # ------------------------------------------------------------------

    def is_within_calling_hours(self, current_hour: int = None) -> bool:
        """Check if the current hour is within TCPA-compliant calling hours."""
        if current_hour is None:
            current_hour = datetime.now().hour
        return self.CALL_START_HOUR <= current_hour < self.CALL_END_HOUR

    # ------------------------------------------------------------------
    # Full lead eligibility check
    # ------------------------------------------------------------------

    def is_lead_callable(self, lead: Lead) -> tuple[bool, str]:
        """Return (is_callable, reason) for a given lead.

        Checks:
          1. Lead status must be pending.
          2. Phone number must not be on DNC list.
          3. Current time must be within calling hours.
        """
        if lead.status == LeadStatus.do_not_call:
            return False, "Lead is on Do-Not-Call list"

        if lead.status != LeadStatus.pending:
            return False, f"Lead status is '{lead.status}', expected 'pending'"

        if self.is_on_dnc(lead.phone_number):
            # Sync the DB status
            if self.db:
                lead.status = LeadStatus.do_not_call
                self.db.commit()
            return False, "Phone number is on DNC list"

        if not self.is_within_calling_hours():
            return False, "Outside of permitted TCPA calling hours (8 AM – 9 PM)"

        return True, "OK"

    # ------------------------------------------------------------------
    # Bulk scrub
    # ------------------------------------------------------------------

    def scrub_leads_against_dnc(self, leads: List[Lead]) -> List[Lead]:
        """Mark any leads whose numbers are in the DNC list as do_not_call.
        Returns the list of scrubbed (DNC-flagged) leads."""
        scrubbed = []
        for lead in leads:
            if self.is_on_dnc(lead.phone_number):
                lead.status = LeadStatus.do_not_call
                scrubbed.append(lead)
        if self.db and scrubbed:
            self.db.commit()
        return scrubbed
