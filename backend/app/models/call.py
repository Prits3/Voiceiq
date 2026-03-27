import enum
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class CallStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    failed = "failed"


class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=False)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=False)
    status = Column(Enum(CallStatus), default=CallStatus.pending, nullable=False)
    duration = Column(Float, nullable=True)  # in seconds
    recording_url = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)
    twilio_call_sid = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("Lead", back_populates="calls")
    campaign = relationship("Campaign", back_populates="calls")
