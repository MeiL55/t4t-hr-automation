import boto3
import os
import webbrowser
from dotenv import load_dotenv
from datetime import datetime

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

file_path = os.path.join(os.path.dirname(__file__), "test_resume.pdf")
file_key = f"test_resume_{datetime.utcnow().timestamp()}.pdf"

try:
    with open(file_path, "rb") as f:
        s3.upload_fileobj(
            Fileobj=f,
            Bucket=S3_BUCKET_NAME,
            Key=file_key,
            ExtraArgs={"ContentType": "application/pdf"}
        )
    print(f"Upload success, s3 key: {file_key}")
except Exception as e:
    print("Upload failed：", e)

try:
    url = s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": S3_BUCKET_NAME, "Key": file_key},
        ExpiresIn=600
    )
    webbrowser.open(url)
except Exception as e:
    print("URL generation failed:", e)