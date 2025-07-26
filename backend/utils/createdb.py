#import sys
#import os
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
#from backend.models.database import Base, engine
#from backend.models.user import User
#from backend.models.application import Application

#Base.metadata.create_all(bind=engine)

#print("Tables created successfully.")

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load environment variables from your main .env file
# This is crucial for connecting to the right database
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

# Add the project root directory to the Python path
# This allows the script to find your model files
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import the 'Base' and all your models
from backend.models.database import Base
from backend.models.user import User
from backend.models.application import Application

# Get the database URL from your .env file
DATABASE_URL = os.getenv("SUPABASE_DB_URL")

if not DATABASE_URL:
    print("ERROR: SUPABASE_DB_URL is not set in your .env file.")
    sys.exit(1)

# Create the database engine
engine = create_engine(DATABASE_URL)

def reset_database():
    """
    Drops all existing tables and recreates them from scratch based on the current models.
    WARNING: THIS WILL DELETE ALL DATA IN THE TABLES.
    """
    try:
        print("--- DELETING ALL EXISTING TABLES ---")
        Base.metadata.drop_all(engine)
        print("--- CREATING NEW TABLES ---")
        Base.metadata.create_all(engine)
        print("✅ Database has been reset successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    print("⚠️  WARNING: This script will delete all data in your database.")
    choice = input("Are you sure you want to reset the database? (yes/no): ")
    if choice.lower() == 'yes':
        reset_database()
    else:
        print("Database reset cancelled.")