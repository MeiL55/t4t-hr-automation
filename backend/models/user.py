
from pymongo import MongoClient
import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)
print(os.getenv("MONGO_URI"))
client = MongoClient(os.getenv("MONGO_URI"))
db = client["t4t_hr"]
users = db["users"]

res = users.insert_one({
    "email": "meili@example.com",
    "role": "applicant",
    "name": "Mei Li"
})
print("Inserted with ID:", res.inserted_id)
print(client.list_database_names())