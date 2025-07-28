import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.celery_app import celery_app
from backend.services.send_email_stages import send_email_for_stage
from backend.models.application import Application
from backend.models.database import SessionLocal

@celery_app.task
def batch_send_stage_emails():
    """
    This task checks all applications with finalized stages (rejected, interview_1, etc.)
    and sends corresponding emails, only if not yet sent.
    """
    print("=== Running batch email sender ===")
    with SessionLocal() as db:
        applications = db.query(Application).filter(
            Application.stage.in_(["rejected_basic", "rejected_keyword", "rejected_interview", "rejected_other", "interview_1", "interview_2", "offer_sent"])
        ).all()
        sent = 0
        for app in applications:
            if (app.stage == "rejected_basic" and not app.rejection_email_sent) or \
               (app.stage == "rejected_keyword" and not app.rejection_email_sent) or \
               (app.stage == "rejected_interview" and not app.rejection_email_sent) or \
               (app.stage == "rejected_other" and not app.rejection_email_sent) or \
               (app.stage == "interview_1" and not app.interview_1_email_sent) or \
               (app.stage == "interview_2" and not app.interview_2_email_sent) or \
               (app.stage == "offer_sent" and not app.offer_email_sent):
                print(f"Sending email for applicant ID: {app.id}, stage: {app.stage}")
                send_email_for_stage(app, db)
                sent += 1
    print(f"Batch email task completed. Total emails sent: {sent}")
