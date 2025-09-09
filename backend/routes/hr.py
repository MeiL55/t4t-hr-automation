from flask import Blueprint, jsonify
import sys,os
from flask import request
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.models.application import Application
from backend.models.evaluation import Evaluation
from backend.services.s3_upload import generate_presigned_resume_url

from backend.routes.auth import cookie_auth_required
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

hr_dashboard_bp = Blueprint('hr_dashboard', __name__)

@hr_dashboard_bp.route('/api/hr_dashboard', methods=['GET'])
@cookie_auth_required
def get_interview_stage_applications():
    db = SessionLocal()
    try:
        hr_user = request.current_user
        print(f"current hr user: ID={hr_user.id}, name={hr_user.full_name}, team={hr_user.hr_team}")
        apps_query = db.query(Application).filter(
            (
                (Application.stage == 'interview_1') &
                (Application.team_applied == hr_user.hr_team)
            ) |
            (
                (Application.stage == 'interview_2') &
                ((Application.team_applied == hr_user.hr_team) & (hr_user.dept_lead))
            ) |
            (
                (Application.stage == 'rejected_interview_1') &
                (Application.team_applied == hr_user.hr_team)
            ) |
            (
                (Application.stage == 'rejected_interview_2') &
                ((Application.team_applied == hr_user.hr_team) & (hr_user.dept_lead))
            ) |
            (
                (Application.stage == 'offer_sent') &
                ((Application.team_applied == hr_user.hr_team) & (hr_user.dept_lead))
            )
        )
        apps = apps_query.all()
        results = []
        for app in apps:
            applicant = app.user
            print(f"申请 {app.id}: 申请者ID={app.user.id}, 申请者姓名={app.user.full_name}")
            results.append({
                "application_id": app.id,
                "user_id": applicant.id,
                "name": applicant.full_name,
                "email": applicant.email,
                "telephone": applicant.telephone,
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
@cookie_auth_required
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

@hr_dashboard_bp.route("/api/evaluation/get", methods=["GET"])
@cookie_auth_required
def get_evaluation():
    db = SessionLocal()
    try:
        application_id = request.args.get("application_id")
        stage = request.args.get("stage")
        if not application_id or not stage:
            return jsonify({"error": "Missing application_id or stage"}), 400
        evaluation = db.query(Evaluation).filter_by(
            application_id=application_id,
            stage=stage
        ).first()
        if not evaluation:
            return jsonify({"found": False}), 200
        return jsonify({
            "found": True,
            "rating": evaluation.rating,
            "notes": evaluation.notes,
            "updated_at": evaluation.updated_at.isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
@hr_dashboard_bp.route("/api/evaluation/save", methods=["POST"])
@cookie_auth_required
def save_evaluation():
    db = SessionLocal()
    try:
        data = request.get_json()
        application_id = data.get("application_id")
        stage = data.get("stage")
        rating = data.get("rating")
        notes = data.get("notes", "")
        if not application_id or not stage or rating is None:
            return jsonify({"error": "Missing fields"}), 400

        evaluation = db.query(Evaluation).filter_by(
            application_id=application_id,
            stage=stage
        ).first()
        if evaluation:
            evaluation.rating = rating
            evaluation.notes = notes
        else:
            evaluation = Evaluation(
                application_id=application_id,
                stage=stage,
                rating=rating,
                notes=notes
            )
            db.add(evaluation)

        db.commit()
        return jsonify({"success": True})

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()
