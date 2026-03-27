import csv
import io
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.campaign import Campaign
from app.models.lead import Lead
from app.models.user import User
from app.schemas.lead import LeadCreate, LeadResponse, LeadUpdate

router = APIRouter(prefix="/leads", tags=["leads"])


def _verify_campaign_owner(campaign_id: int, user_id: int, db: Session) -> Campaign:
    campaign = (
        db.query(Campaign)
        .filter(Campaign.id == campaign_id, Campaign.user_id == user_id)
        .first()
    )
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    return campaign


@router.get("/", response_model=List[LeadResponse])
def list_leads(
    campaign_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if campaign_id is not None:
        _verify_campaign_owner(campaign_id, current_user.id, db)
        return (
            db.query(Lead)
            .filter(Lead.campaign_id == campaign_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    owned_ids = [
        c.id for c in db.query(Campaign).filter(Campaign.user_id == current_user.id).all()
    ]
    return (
        db.query(Lead)
        .filter(Lead.campaign_id.in_(owned_ids))
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _verify_campaign_owner(lead_data.campaign_id, current_user.id, db)
    lead = Lead(**lead_data.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    _verify_campaign_owner(lead.campaign_id, current_user.id, db)
    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
def update_lead(
    lead_id: int,
    lead_data: LeadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    _verify_campaign_owner(lead.campaign_id, current_user.id, db)
    for field, value in lead_data.model_dump(exclude_unset=True).items():
        setattr(lead, field, value)
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    _verify_campaign_owner(lead.campaign_id, current_user.id, db)
    db.delete(lead)
    db.commit()


@router.post("/import", response_model=List[LeadResponse], status_code=status.HTTP_201_CREATED)
async def bulk_import_leads(
    campaign_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Import leads from a CSV file. Expected columns: first_name, last_name, phone_number, email"""
    _verify_campaign_owner(campaign_id, current_user.id, db)

    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Only CSV files are accepted"
        )

    content = await file.read()
    reader = csv.DictReader(io.StringIO(content.decode("utf-8")))

    required = {"first_name", "phone_number"}
    if not required.issubset(set(reader.fieldnames or [])):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"CSV must contain columns: {required}",
        )

    created_leads = []
    for row in reader:
        lead = Lead(
            campaign_id=campaign_id,
            first_name=row["first_name"].strip(),
            last_name=row.get("last_name", "").strip() or None,
            phone_number=row["phone_number"].strip(),
            email=row.get("email", "").strip() or None,
        )
        db.add(lead)
        created_leads.append(lead)

    db.commit()
    for lead in created_leads:
        db.refresh(lead)
    return created_leads
