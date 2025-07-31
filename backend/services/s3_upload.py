import os,sys
import base64
import boto3
import uuid
import io
from datetime import datetime
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.services.screening import calculate_keyword_score
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

#get pdf file from the s3 by filename
def score_from_s3(filename, team_applied):
    bucket = S3_BUCKET_NAME
    key = filename
    try:
        # 1. get pdf from s3 by key(filename)
        response = s3.get_object(Bucket=bucket, Key=key)
        file_bytes = response["Body"].read()
        assert isinstance(file_bytes, bytes), f"Expected bytes, got {type(file_bytes)}"
        #print(file_bytes)
        # 2. call scoring function
        return calculate_keyword_score(file_bytes, team_applied)
    except Exception as e:
        print("Error scoring resume:", e)
        raise

def generate_presigned_resume_url(key: str, expires: int = 7200) -> str:
    try:
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": S3_BUCKET_NAME, "Key": key},
            ExpiresIn=expires
        )
        return url
    except Exception as e:
        print("URL generation failed:", e)
        return ""