import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.services.screening import screen_applications

db = SessionLocal()
screen_applications(db)  # Will use real DB, foreign keys already exist
