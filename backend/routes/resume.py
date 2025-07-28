from flask import Blueprint, request, jsonify
import base64, uuid, io
import sys, os
from botocore.exceptions import ClientError
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.services.s3_upload import upload_resume_to_s3
resume_bp = Blueprint('resume', __name__)
@resume_bp.route('/api/upload_resume', methods=['POST'])
def upload_resume_route():
    try:
        data = request.get_json()
        resume = data.get("resume")
        if not resume or not resume.get("content") or not resume.get("name"):
            return jsonify({"error": "Invalid resume data"}), 400
        filename = upload_resume_to_s3(resume)
        return jsonify({"resume_filename": filename}), 200
    except ClientError as ce:
        return jsonify({"error": "S3 Client Error", "details": str(ce)}), 500
    except Exception as e:
        return jsonify({"error": "Upload failed", "details": str(e)}), 500