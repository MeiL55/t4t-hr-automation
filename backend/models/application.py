from sqlalchemy import (
    Column, Integer, String, Float, Date, Boolean, ForeignKey, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.sql import func
from .database import Base

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from sqlalchemy.orm import relationship
from backend.models.user import User

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # One-to-one with User
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    user = relationship("User", backref="application", lazy="joined")
    # Applicant info
    date_of_birth = Column(Date, nullable=False)
    guardian_phone = Column(String, nullable=True)
    resume_url = Column(String, nullable=False)
    gpa = Column(Float, nullable=True)
    us_based = Column(Boolean)
    has_criminal_record = Column(Boolean)
    education_level = Column(String)
    school = Column(String)
    team_applied = Column(String)
    # Stage: full lifecycle tracking
    stage = Column(String, default="submitted")
    # Email tracking
    interview_1_email_sent = Column(Boolean, default=False)
    interview_2_email_sent = Column(Boolean, default=False)
    offer_email_sent = Column(Boolean, default=False)
    rejection_email_sent = Column(Boolean, default=False)
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", name="unique_user_application"),
        # GPA must be valid
        CheckConstraint("gpa >= 0 AND gpa <= 4.0", name="check_gpa_range"),
        # Education level should be within expected values
        CheckConstraint(
            "education_level IN ('less_than_high_school', 'high_school', 'associates', 'bachelors', 'masters', 'phd')",
            name="check_edu_level"
        ),
        CheckConstraint(
            "team_applied IN ('software', 'finance', 'media', 'outreach', 'human_resources', 'chapters')",
            name="check_team_applied"
        ),
        # Allowed values for stage (replace status entirely)
        CheckConstraint(
            "stage IN ("
            "'submitted', "
            "'screening', "
            "'interview_1', "
            "'interview_2', "
            "'offer_sent', "
            "'hired', "
            "'rejected')",
            name="check_stage_valid"
        ),
    )