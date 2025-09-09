from flask import Blueprint, request, jsonify
import base64, uuid, io
import sys, os
from botocore.exceptions import ClientError
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.services.s3_upload import upload_resume_to_s3
from backend.routes.auth import cookie_auth_required
resume_bp = Blueprint('resume', __name__)
@resume_bp.route('/api/upload_resume', methods=['POST'])
@cookie_auth_required  # Add authentication requirement
def upload_resume_route():
    try:
        user = request.current_user
        data = request.get_json()
        resume = data.get("resume")
        if not resume or not resume.get("content") or not resume.get("name"):
            return jsonify({"error": "Invalid resume data"}), 400
        # Optional: Add file size/type validation
        # Optional: Include user info in filename for tracking
        filename = upload_resume_to_s3(resume)
        # Log for security monitoring
        print(f"Resume uploaded by user {user.id}: {filename}")
        return jsonify({"resume_filename": filename}), 200
    except ClientError as ce:
        print(f"S3 Client Error for user {user.id}: {str(ce)}")  # Log for debugging
        return jsonify({"error": "Upload service temporarily unavailable"}), 503
    except Exception as e:
        print(f"Resume upload error for user {user.id}: {str(e)}")  # Log for debugging
        return jsonify({"error": "Upload failed"}), 500