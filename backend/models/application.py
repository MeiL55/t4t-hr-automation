from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.sql import func
from .database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_url = Column(String, nullable=False)
    gpa = Column(Float, nullable=True)
    date_of_birth = Column(Date)
    us_based = Column(Boolean)
    has_criminal_record = Column(Boolean)
    education_level = Column(String)
    status = Column(String, default="submitted")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("gpa >= 0 AND gpa <= 4.0", name="check_gpa_range"),
        CheckConstraint("education_level IN ('less_than_high_school', 'high_school', 'college', 'master', 'phd')", name="check_edu_level"),
        CheckConstraint("status IN ('submitted', 'screening', 'interview', 'offered', 'rejected')", name="check_status"),
    )
