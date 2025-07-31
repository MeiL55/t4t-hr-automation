from flask import Blueprint, jsonify
import sys,os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.models.application import Application
from backend.services.s3_upload import generate_presigned_resume_url
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

hr_dashboard_bp = Blueprint('hr_dashboard', __name__)

@hr_dashboard_bp.route('/api/hr_dashboard', methods=['GET'])
def get_interview_stage_applications():
    db = SessionLocal()
    try:
        apps = (
            db.query(Application)
            .filter(Application.stage.in_(['interview_1', 'interview_2']))
            .all()
        )
        results = []
        for app in apps:
            results.append({
                "application_id": app.id,
                "user_id": app.user.id,
                "name": app.user.full_name,
                "email": app.user.email,
                "stage": app.stage,
                "resume_filename": app.resume_filename,
                "resume_url": generate_presigned_resume_url(app.resume_filename, expires=7200)
            })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
