from sqlalchemy import (
    Column, Integer, String, Float, Date, Boolean, ForeignKey, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.sql import func
from .database import Base
import sys
import os
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
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
    resume_filename = Column(String, nullable=False)
    gpa = Column(Float, nullable=True)
    us_based = Column(Boolean)
    has_criminal_record = Column(Boolean)
    education_level = Column(String)
    school = Column(String)
    team_applied = Column(String)
    # Position
    role_applied = Column(String)
    referral = Column(Boolean, default=False)
    # Keyword screening score (nullable until Celery task completes)
    keyword_score = Column(Integer, nullable=True)
    # Stage: Updated to support separate screening phases
    stage = Column(String, default="submitted")
    # Email tracking
    interview_1_email_sent = Column(Boolean, default=False)
    interview_2_email_sent = Column(Boolean, default=False)
    offer_email_sent = Column(Boolean, default=False)
    rejection_email_sent = Column(Boolean, default=False)
    # Assigned HR, for HR dashboard access control
    assigned_hr = Column(String, nullable=True)
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
            "team_applied IN ('software', 'finance', 'media', 'outreach', 'special_ops', 'human_resources', 'chapters')",
            name="check_team_applied"
        ),
        # Updated stage values to support separate screening phases
        CheckConstraint(
            "stage IN ("
            "'submitted', "           # Initial state after form submission
            "'pending_keyword', "     # Passed basic screening, waiting for keyword score
            "'interview_1', "         # Passed all screening, ready for first interview
            "'interview_2', "         # Passed first interview
            "'offer_sent', "          # Offer has been sent
            "'hired', "               # Accepted offer
            "'rejected_basic', "      # Failed basic screening (GPA, age, etc.)
            "'rejected_keyword', "    # Failed keyword screening
            "'rejected_interview_1', "  # Failed during interview process
            "'rejected_interview_2', "
            "'rejected_other')"       # Other rejection reasons
            ,
            name="check_stage_valid"
        ),
    )