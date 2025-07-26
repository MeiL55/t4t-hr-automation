import sys
import os
import json
from datetime import date
from sqlalchemy.orm import Session
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.user import User
from backend.models.application import Application
from backend.services.send_email_stages import send_email_for_stage
from pdfminer.high_level import extract_text


MIN_GPA = 2.0
AGE_RANGE = (15, 23)
EDU_LEVELS_ALLOWED = ['high_school', 'bachelors'] 

def calculate_age(dob: date) -> int:
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

def is_disqualified(app: Application) -> bool:
    age = calculate_age(app.date_of_birth) if app.date_of_birth else None
    disqualified = (
        app.gpa is not None and app.gpa < MIN_GPA or
        not app.us_based or
        age is None or age < AGE_RANGE[0] or age > AGE_RANGE[1] or
        app.has_criminal_record or
        app.education_level not in EDU_LEVELS_ALLOWED
    )
    print(f"Disqualified Check: {disqualified}")
    return disqualified

def screen_applications(app: Application, db: Session) -> str:
    """
    This is the main screening function that decides if a candidate
    is rejected or moved to the first interview stage.
    """
    print(f"--- Running screening for application ID: {app.id} ---")
    
    if is_disqualified(app):
        app.stage = 'rejected'
        db.add(app)
        print("Application REJECTED based on initial criteria.")
        # send_email_for_stage(app, db) 
    else:
        app.stage = 'interview_1'
        db.add(app)
        print("Application PASSED to interview stage.")
        # send_email_for_stage(app, db) 
        
    db.commit() 
    print(f"--- Screening complete for application ID: {app.id} ---")
    return app.id


def parse_resume_keywords(path: str) -> str:
    """
    Parses a local PDF resume and returns the text content.
    """
    try:
        text = extract_text(path)
        return text.lower()
    except Exception as e:
        print(f"ERROR: Failed to parse resume. Reason: {e}")
        return ""

def calculate_keyword_score(resume_text, role):
    """
    Calculates a score for a resume based on keywords for a specific role.
    """
    score = 0
    resume_text_lower = resume_text.lower()
    
    
    role_key = role.title()

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