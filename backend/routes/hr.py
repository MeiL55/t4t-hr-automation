from flask import Blueprint, jsonify
import sys,os
from flask import request
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.models.application import Application
from backend.services.s3_upload import generate_presigned_resume_url
from backend.routes.auth import get_current_user
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
        user = get_current_user(request)
        apps_query = db.query(Application).filter(
            (
                (Application.stage == 'interview_1') &
                (Application.team_applied == user.hr_team)
            ) |
            (
                (Application.stage == 'interview_2') &
                ((Application.team_applied == user.hr_team) & (user.dept_lead))
            ) |
            (
                (Application.stage == 'rejected_interview_1') &
                (Application.team_applied == user.hr_team)
            ) |
            (
                (Application.stage == 'rejected_interview_2') &
                ((Application.team_applied == user.hr_team) & (user.dept_lead))
            ) |
            (
                (Application.stage == 'offer_sent') &
                ((Application.team_applied == user.hr_team) & (user.dept_lead))
            )

        )
        apps = apps_query.all()
        results = []
        for app in apps:
            results.append({
                "application_id": app.id,
                "user_id": app.user.id,
                "name": app.user.full_name,
                "email": app.user.email,
                "telephone": app.user.telephone,
                "stage": app.stage,
                "resume_filename": app.resume_filename,
                "resume_url": generate_presigned_resume_url(app.resume_filename, expires=7200)
            })
        return jsonify(results)
    except Exception as e:
        raise
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@hr_dashboard_bp.route('/api/update_stage', methods=['POST'])
def update_application_stage():
    db = SessionLocal()
    try:
        data = request.get_json()
        #print("Received JSON:", data)
        application_id = data.get('application_id')
        new_stage = data.get('new_stage')
        print("Updating application", application_id, "→", new_stage)
        if not application_id or not new_stage:
            print("Missing data")
            return jsonify({"error": "Missing fields"}), 400
        app = db.query(Application).filter_by(id=application_id).first()
        if not app:
            print("Application not found")
            return jsonify({"error": "Application not found"}), 404
        app.stage = new_stage
        db.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.rollback()
        print("Exception occurred:", str(e))
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
