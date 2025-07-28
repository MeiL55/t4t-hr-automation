import os
import base64
import boto3
import uuid
import io
from datetime import datetime
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

s3 = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)
def upload_resume_to_s3(resume_obj):
    """
    Uploads a base64-encoded PDF resume to S3 and returns the public URL.
    :param resume_obj: dict containing 'name', 'type', and 'content' (base64 string)
    :return: public S3 URL of the uploaded resume
    """
    try:
        # Decode base64
        content_base64 = resume_obj["content"].split(",")[1]
        file_bytes = base64.b64decode(content_base64)
        # Generate unique filename
        filename = f"{uuid.uuid4()}_{resume_obj['name']}"
        # Upload to S3
        s3.upload_fileobj(
            io.BytesIO(file_bytes),
            Bucket=S3_BUCKET_NAME,
            Key=filename,
            ExtraArgs={"ContentType": "application/pdf"}
        )
        # Return filename
        return filename
    except Exception as e:
        print("Resume upload failed:", e)
        raise
