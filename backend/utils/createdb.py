import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import Base, engine
from backend.models.user import User
from backend.models.application import Application

Base.metadata.create_all(bind=engine)

print("Tables created successfully.")
