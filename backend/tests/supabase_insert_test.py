
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.models.user import User
from backend.models.application import Application
from sqlalchemy.orm import sessionmaker


session = SessionLocal()

new_user = User(
    email="iamlm0510@163.com",
    full_name="Mya Li",
    password_hash="hashedpwd",
    role="applicant"
)
session.add(new_user)
session.commit()  # This assigns an ID
session.refresh(new_user)

print("Insert user response:", new_user)
new_application = Application(
    user_id=new_user.id,
    resume_url="https://example.com/resume.pdf",
    gpa=3.8,
    date_of_birth="2006-05-01",
    us_based=True,
    has_criminal_record=False,
    education_level="college",
    stage="submitted"
)
session.add(new_application)
session.commit()

print("Insert application response:", new_application)

session.close()
