from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import IntegrityError
import sys, os
import jwt
from jwt import InvalidTokenError
from datetime import datetime, timedelta
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.models.user import User
from backend.models.application import Application
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)

auth_bp = Blueprint("auth", __name__)
@auth_bp.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")
    telephone = data.get("telephone")
    if not email or not password or not full_name:
        return jsonify({"error": "Missing required fields"}), 400
    db = SessionLocal()
    # Check for existing email
    existing = db.query(User).filter_by(email=email).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 400
    try:
        new_user = User(
            email=email,
            password_hash=generate_password_hash(password, method="pbkdf2:sha256"),
            full_name=full_name,
            telephone=telephone,
            role="applicant",
        )
        db.add(new_user)
        db.commit()
        return jsonify({"success": True}), 201
    except IntegrityError as e:
        db.rollback()
        print("SIGNUP ERROR:", e)
        return jsonify({"error": "Database error"}), 500

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret")
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    db = SessionLocal()
    user = db.query(User).filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=8)
    }

    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm="HS256")
    return jsonify({"token": token})

@auth_bp.route("/api/check_email", methods=["POST"])
def check_email():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400
    db = SessionLocal()
    exists = db.query(User).filter_by(email=email).first()
    return jsonify({"available": exists is None})

@auth_bp.route("/api/check_telephone", methods=["POST"])
def check_telephone():
    data = request.get_json()
    telephone = data.get("telephone")
    if not telephone:
        return jsonify({"error": "Telephone is required"}), 400
    db = SessionLocal()
    exists = db.query(User).filter_by(telephone=telephone).first()
    return jsonify({"available": exists is None})

@auth_bp.route("/api/application_status", methods=["GET"])
def application_status():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid token"}), 401
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except InvalidTokenError:
        return jsonify({"error": "Invalid or expired token"}), 401
    user_id = payload.get("user_id")
    if not user_id:
        return jsonify({"error": "Invalid token payload"}), 401
    db = SessionLocal()
    application = db.query(Application).filter_by(user_id=user_id).first()
    if application:
        return jsonify({ "status": application.stage })
    else:
        return jsonify({ "status": "not_started" })

def get_current_user(request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise Exception("Missing or invalid token")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
    except InvalidTokenError:
        raise Exception("Invalid or expired token")
    user_id = payload.get("user_id")
    if not user_id:
        raise Exception("Invalid token payload")
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            raise Exception("User not found")
        return user
    finally:
        db.close()
