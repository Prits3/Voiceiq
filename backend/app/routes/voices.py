from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.voice_profile import VoiceProfile
from app.schemas.voice_profile import VoiceProfileCreate, VoiceProfileResponse, VoiceProfileUpdate

router = APIRouter(prefix="/voices", tags=["voices"])


@router.get("/", response_model=List[VoiceProfileResponse])
def list_voice_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(VoiceProfile).filter(VoiceProfile.user_id == current_user.id).all()


@router.post("/", response_model=VoiceProfileResponse, status_code=status.HTTP_201_CREATED)
def create_voice_profile(
    data: VoiceProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = VoiceProfile(**data.model_dump(), user_id=current_user.id)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/{profile_id}", response_model=VoiceProfileResponse)
def get_voice_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(VoiceProfile)
        .filter(VoiceProfile.id == profile_id, VoiceProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voice profile not found")
    return profile


@router.put("/{profile_id}", response_model=VoiceProfileResponse)
def update_voice_profile(
    profile_id: int,
    data: VoiceProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(VoiceProfile)
        .filter(VoiceProfile.id == profile_id, VoiceProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voice profile not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_voice_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(VoiceProfile)
        .filter(VoiceProfile.id == profile_id, VoiceProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Voice profile not found")
    db.delete(profile)
    db.commit()
