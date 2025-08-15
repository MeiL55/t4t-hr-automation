import sys
import os
import json
from datetime import date
from sqlalchemy.orm import Session
from io import BytesIO
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.user import User
from backend.models.application import Application
from backend.services.send_email_stages import send_email_for_stage
from pdfminer.high_level import extract_text
from typing import Optional


MIN_GPA = 2.0
AGE_RANGE = (15, 25)
EDU_LEVELS_ALLOWED = ['high_school', 'associates', 'bachelors', 'masters']
MIN_KEYWORD_SCORE = 25

def check_valid_referral(referral: str) -> bool:
    valid_code = "internfall25"
    return referral == valid_code
def calculate_age(dob: date) -> int:
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

def parse_resume_keywords(pdf_bytes: bytes) -> str:
    """
    Parses a local PDF resume and returns the text content.
    """
    try:
        text = extract_text(BytesIO(pdf_bytes))
        return text.lower()
    except Exception as e:
        print(f"ERROR: Failed to parse resume. Reason: {e}")
        return ""

def calculate_keyword_score(pdf_bytes: bytes, role: str):
    """
    Calculates a score for a resume based on keywords for a specific role.
    """
    score = 0
    resume_text_lower = parse_resume_keywords(pdf_bytes)
    role_key = role
    keywords_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'role_keywords.json')
    try:
        with open(keywords_path, 'r') as f:
            all_keywords = json.load(f)
    except FileNotFoundError:
        print("Error: role_keywords.json not found.")
        return 0
    role_keywords = all_keywords.get(role_key)
    if not role_keywords:
        print(f"Warning: No keywords defined for role: {role_key}")
        return 0
    print(f"Calculating score for role: {role_key}")
    for keyword, points in role_keywords.items():
        if keyword.lower() in resume_text_lower:
            score += points
            print(f"  + Found keyword '{keyword.lower()}' for {points} points.")
    print(f"Total Keyword Score: {score}")
    return score

def screen_basic_filters(app: Application, db: Session) -> bool:
    """Screen application against hard filters"""
    print(f"--- Running basic screening for application ID: {app.id} ---")
    age = calculate_age(app.date_of_birth) if app.date_of_birth else None
    disqualified = (
        app.gpa is not None and app.gpa < MIN_GPA or
        not app.us_based or
        age is None or age < AGE_RANGE[0] or age > AGE_RANGE[1] or
        app.has_criminal_record or
        app.education_level not in EDU_LEVELS_ALLOWED
    )
    if disqualified:
        print("Basic screening FAILED")
        app.stage = 'rejected_basic'
        db.add(app)
        db.commit()
        return False
    else:
        print("Basic screening PASSED - moving to keyword screening phase")
        app.stage = 'pending_keyword'
        db.add(app)
        db.commit()
        return True

def screen_keyword_requirements(app: Application, db: Session) -> bool:
    """Screen application against keyword score requirements"""
    print(f"--- Running keyword screening for application ID: {app.id} ---")
    if app.keyword_score is None:
        print("ERROR: Keyword score not available")
        return False
    if app.keyword_score < MIN_KEYWORD_SCORE:
        print(f"Keyword screening FAILED: score {app.keyword_score}")
        app.stage = 'rejected_keyword'
        db.add(app)
        db.commit()
        return False
    else:
        print(f"Keyword screening PASSED: score {app.keyword_score}")
        app.stage = 'interview_1'
        db.add(app)
        db.commit()
        return True