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
KEYWORDS = ["intern", "computer science", "software", "python", "java"]



# ----- Screening criteria -----
MIN_GPA = 2.0
AGE_RANGE = (15, 23)
EDU_LEVELS_ALLOWED = ['high_school', 'college']

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
    print(disqualified)
    return disqualified
def screen_applications(app: Application, db: Session) -> str:
    #applications = db.query(Application).filter(Application.stage == 'submitted').all()
    print(app)
    #passed_ids = []
    if is_disqualified(app):
        app.stage = 'rejected'
        db.add(app) #for safety of tracking status
        print("ready?")
        send_email_for_stage(app, db)
    else:
        app.stage = 'interview_1'
        db.add(app)
        send_email_for_stage(app, db)
        #passed_ids.append(app.id)
    db.commit()
    return app.id

#for future use
def parse_resume_keywords(path: str) -> dict:
    """
    Parses a local PDF resume using pyresparser and returns structured info.
    """
    try:
        #print(path)
        text = extract_text(path)
        #print(text)
        text_lower = text.lower()
        found = [kw for kw in KEYWORDS if kw in text_lower]
        return {
            "matched_keywords": found,
            "matched_count": len(found),
            "is_qualified": len(found) >= 3
        }
    except Exception as e:
        print(f"ERROR: Failed to parse resume. Reason: {e}")
        return None

def calculate_keyword_score(resume_text, role):
    """
    Calculates a score for a resume based on keywords for a specific role.
    """
    score = 0
    resume_text_lower = resume_text.lower()

    # Construct the path to the keywords file
    keywords_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'role_keywords.json')

    try:
        with open(keywords_path, 'r') as f:
            all_keywords = json.load(f)
    except FileNotFoundError:
        print("Error: keywords.json not found.")
        return 0
    role_key = role.title()

    # Get the keywords and points for the specific role using the corrected key
    role_keywords = all_keywords.get(role_key)
    if not role_keywords:
        # This warning will now only show if the role truly doesn't exist in the JSON
        print(f"Warning: No keywords defined for role: {role_key}")
        return 0

    # Calculate score
    for keyword, points in role_keywords.items():
        if keyword.lower() in resume_text_lower:
            score += points
            
    return score