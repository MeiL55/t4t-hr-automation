from sqlalchemy import Column, Integer, String, Text, DateTime, CheckConstraint, UniqueConstraint, ForeignKey
from sqlalchemy.sql import func
from backend.models.database import Base

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('applications.id', ondelete='CASCADE'), nullable=False)
    stage = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    notes = Column(Text)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('application_id', 'stage', name='_application_stage_uc'),
        CheckConstraint("stage IN ('interview_1', 'interview_2')", name='valid_stage'),
    )
