from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
import sys, os
import jwt
from datetime import datetime, timedelta
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.models.user import User
from backend.models.application import Application
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
from flask import Blueprint, request, jsonify
from backend.utils.auth_utils import token_required
from backend.services.screening import screen_applications

user_bp = Blueprint("user", __name__)
@user_bp.route("/api/user_info", methods=["GET"])
@token_required
def get_user_info():
    user = request.user
    print(user)
    return jsonify({
        "email": user.email,
        "telephone": user.telephone,
        "full_name": user.full_name
    })

@user_bp.route("/api/application", methods=["POST"])
@token_required
def submit_application():
    user = request.user
    data = request.json
    try:
        app = Application(
            user_id=user.id,
            date_of_birth=data["date_of_birth"],
            gpa=float(data["gpa"]),
            us_based=data["us_based"],
            has_criminal_record=data["has_criminal_record"],
            education_level=data["education_level"],
            resume_url="https://dummy.resume.com", #set for dummy right now
            team_applied=data["team_applied"],
            guardian_phone=data.get("guardian_phone"),
            school=data.get("school")
        )
        db = SessionLocal()
        db.add(app)
        db.commit()
        screen_applications(app, db)
        return jsonify({"message": "Application submitted and parsed."}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()