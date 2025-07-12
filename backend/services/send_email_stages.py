import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.utils.email_stage import (
    send_interview1_email,
    send_interview2_email,
    send_offer_email,
    send_rejection_email,
)
from backend.models.application import Application
from backend.models.user import User

def send_email_for_stage(applicant: Application, db):
    stage = applicant.stage
    print("reach method send_email_for_stage")
    if stage == "interview_1" and not applicant.interview_1_email_sent:
        send_interview1_email(applicant)
        applicant.interview_1_email_sent = True
    elif stage == "interview_2" and not applicant.interview_2_email_sent:
        send_interview2_email(applicant)
        applicant.interview_2_email_sent = True
    elif stage == "offer_sent" and not applicant.offer_email_sent:
        send_offer_email(applicant)
        applicant.offer_email_sent = True
    elif stage == "rejected" and not applicant.rejection_email_sent:
        print("email sent?")
        send_rejection_email(applicant)
        applicant.rejection_email_sent = True
    db.add(applicant)
    db.commit()
