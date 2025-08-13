# test_db_connection.py
import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from urllib.parse import urlparse
import socket
from dotenv import load_dotenv
env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(dotenv_path=env_path)

def test_dns_resolution(db_url):
    parsed = urlparse(db_url)
    hostname = parsed.hostname
    try:
        ip = socket.gethostbyname(hostname)
        print(f"success: {hostname} -> {ip}")
        return True
    except socket.gaierror as e:
        print(f"fail: {hostname} ({e})")
        return False

def test_db_connection(db_url):
    try:
        engine = create_engine(db_url, pool_pre_ping=True)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            value = result.scalar()
            if value == 1:
                print("db conn successfuk")
                return True
            else:
                print(f"weird: {value}")
                return False
    except OperationalError as e:
        print(f"error: {e}")
        return False

if __name__ == "__main__":
    db_url = os.getenv("SUPABASE_DB_URL")
    if not db_url:
        print(" no SUPABASE_DB_URL")
        exit(1)

    if not test_dns_resolution(db_url):
        exit(1)

    if not test_db_connection(db_url):
        exit(1)
