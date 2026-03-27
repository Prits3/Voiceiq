from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.phone_number import PhoneNumber
from app.models.user import User
from app.schemas.phone_number import PhoneNumberCreate, PhoneNumberResponse

router = APIRouter(prefix="/phone-numbers", tags=["phone_numbers"])


@router.get("/", response_model=List[PhoneNumberResponse])
def list_phone_numbers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(PhoneNumber).filter(PhoneNumber.user_id == current_user.id).all()


@router.post("/", response_model=PhoneNumberResponse, status_code=status.HTTP_201_CREATED)
def add_phone_number(
    data: PhoneNumberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(PhoneNumber).filter(PhoneNumber.number == data.number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number already registered"
        )
    phone = PhoneNumber(**data.model_dump(), user_id=current_user.id)
    db.add(phone)
    db.commit()
    db.refresh(phone)
    return phone


@router.get("/{number_id}", response_model=PhoneNumberResponse)
def get_phone_number(
    number_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    phone = (
        db.query(PhoneNumber)
        .filter(PhoneNumber.id == number_id, PhoneNumber.user_id == current_user.id)
        .first()
    )
    if not phone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phone number not found")
    return phone


@router.delete("/{number_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_phone_number(
    number_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    phone = (
        db.query(PhoneNumber)
        .filter(PhoneNumber.id == number_id, PhoneNumber.user_id == current_user.id)
        .first()
    )
    if not phone:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Phone number not found")
    db.delete(phone)
    db.commit()
