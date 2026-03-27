import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class LeadStatus(str, enum.Enum):
    pending = "pending"
    called = "called"
    converted = "converted"
    do_not_call = "do_not_call"


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True)
    status = Column(Enum(LeadStatus), default=LeadStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="leads")
    calls = relationship("Call", back_populates="lead", cascade="all, delete-orphan")
