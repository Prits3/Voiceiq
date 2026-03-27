from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.call import Call, CallStatus
from app.models.campaign import Campaign
from app.models.lead import Lead
from app.models.user import User
from app.schemas.call import CallCreate, CallResponse
from app.services.call_service import CallService

router = APIRouter(prefix="/calls", tags=["calls"])


@router.get("/", response_model=List[CallResponse])
def list_calls(
    campaign_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Call).join(Campaign).filter(Campaign.user_id == current_user.id)
    if campaign_id:
        query = query.filter(Call.campaign_id == campaign_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{call_id}", response_model=CallResponse)
def get_call(
    call_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    call = (
        db.query(Call)
        .join(Campaign)
        .filter(Call.id == call_id, Campaign.user_id == current_user.id)
        .first()
    )
    if not call:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Call not found")
    return call


@router.post("/initiate", response_model=CallResponse, status_code=status.HTTP_201_CREATED)
def initiate_call(
    call_data: CallCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    campaign = (
        db.query(Campaign)
        .filter(Campaign.id == call_data.campaign_id, Campaign.user_id == current_user.id)
        .first()
    )
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")

    lead = db.query(Lead).filter(Lead.id == call_data.lead_id).first()
    if not lead or lead.campaign_id != campaign.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")

    service = CallService(db)
    call = service.initiate_call(lead, campaign)
    return call


@router.post("/{call_id}/stop", response_model=CallResponse)
def stop_call(
    call_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    call = (
        db.query(Call)
        .join(Campaign)
        .filter(Call.id == call_id, Campaign.user_id == current_user.id)
        .first()
    )
    if not call:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Call not found")
    if call.status not in (CallStatus.pending, CallStatus.in_progress):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Call cannot be stopped"
        )

    service = CallService(db)
    call = service.stop_call(call)
    return call
