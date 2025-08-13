import sys
import os
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
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
        skip = 0 
        for app in applications:
            try:
                if not is_application_valid(app,db):
                    skip += 1
                    continue
                if needs_email(app):
                    send_email_for_stage(app, db)
            except Exception as e:
                skipped += 1
                continue
    print(f"Batch email task completed. Total emails sent: {sent}")

def is_application_valid(app, db):
    try:
        db.refresh(app)
        if not app.user:
            print(f"Application {app.id}: User not found")
            return False
        if not app.user.email:
            print(f"Application {app.id}: No email address")
            return False
        if hasattr(app, 'deleted_at') and app.deleted_at:
            print(f"Application {app.id}: Soft deleted")
            return False
        return True
    except Exception as e:
        print(f"Application {app.id}: Validation error - {e}")
        return False

def needs_email(app):
    if app.stage.startswith("rejected") and not app.rejection_email_sent:
        return True
    elif app.stage == "interview_1" and not app.interview_1_email_sent:
        return True
    elif app.stage == "interview_2" and not app.interview_2_email_sent:
        return True
    elif app.stage == "offer_sent" and not app.offer_email_sent:
        return True
    return False