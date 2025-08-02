from sqlalchemy import Column, Integer, String, Boolean, DateTime, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ENUM
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    telephone = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)
    #shouldn't be null if the role is hr
    hr_team = Column(String, nullable=True)
    dept_lead = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'hr', 'applicant')", name="check_user_role"),
        CheckConstraint("team IS NULL OR team IN ('software', 'finance', 'media', 'outreach', 'special_ops', 'human_resources', 'chapters')",
    name="check_user_team")
    )