from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime

env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)
print(os.getenv("MONGO_URI"))
client = MongoClient(os.getenv("MONGO_URI"))
db = client["t4t_hr"]
applications = db["applications"]

application = {
    "user_email": "meili@example.com",
    "full_name": "Mei Li",
    "submitted_at": datetime.utcnow(),
    "status": "submitted",
    "resume_s3_url": "",
    "us_based": False,
    "gpa": 3.85,
    "has_criminal_record": False,
    "age": 20,
    "level_of_education": "High School"
}

applications.insert_one(application)
