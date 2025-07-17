import sys
import os
from datetime import date
from sqlalchemy.orm import Session
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.user import User
from backend.models.application import Application
from backend.services.send_email_stages import send_email_for_stage

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
