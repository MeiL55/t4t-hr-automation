
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("SUPABASE_DB_URL")
#print(DATABASE_URL)

if "sslmode=" not in (DATABASE_URL or ""):
    DATABASE_URL += ("&" if "?" in DATABASE_URL else "?") + "sslmode=require"

engine = create_engine(
    DATABASE_URL,
    connect_args={"hostaddr": os.getenv("PGHOSTADDR")},  # <-- force IPv4
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
