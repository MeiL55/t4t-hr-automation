import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.celery_app import celery_app
from backend.models.application import Application
from backend.services.s3_upload import score_from_s3
from backend.services.screening import screen_keyword_requirements
from backend.models.database import SessionLocal
from sqlalchemy.orm import Session

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_resume_and_screen(self, id: int):
    """
    Celery task to:
    1. Process resume from S3
    2. Calculate keyword score
    3. Update application with score
    4. Run keyword screening
    """
    try:
        print(f"Processing resume for application {id}")
        # Get database session
        db = SessionLocal()
        # Fetch application
        app = db.query(Application).filter(Application.id == id).first()
        if not app:
            return f"Application {id} not found"
        # Skip if not in pending_keyword stage
        if app.stage != 'pending_keyword':
            return f"Application {id} not in pending_keyword stage (current: {app.stage})"
        # Calculate keyword score from S3 resume
        try:
            keyword_score = score_from_s3(app.resume_filename, app.team_applied)
            # Update application with score
            app.keyword_score += keyword_score
            db.add(app)
            db.commit()
            print(f"Keyword score calculated: {keyword_score} for application {id}")
        except Exception as e:
            print(f"Error calculating keyword score: {e}")
            # You might want to mark this as failed or retry
            raise self.retry(exc=e)
        # Run keyword screening
        result = screen_keyword_requirements(app, db)
        return {
            'id': id,
            'keyword_score': keyword_score,
            'screening_passed': result,
            'final_stage': app.stage
        }
    except Exception as exc:
        print(f"Task failed for application {id}: {exc}")
        # Retry the task
        raise self.retry(exc=exc)