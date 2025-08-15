# backend/db.py
import os
import socket
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

# Use the official Supabase SQLAlchemy URL here (with sslmode=require)
# Example from Supabase console:
# postgresql+psycopg2://postgres:<PASSWORD>@db.<REF>.supabase.co:5432/postgres?sslmode=require&connect_timeout=5
BASE_URL = os.getenv("SUPABASE_DB_URL_BASE") or os.getenv("SUPABASE_DB_URL")
if not BASE_URL:
    raise RuntimeError("Missing SUPABASE_DB_URL_BASE / SUPABASE_DB_URL")

def add_ipv4_hostaddr(url: str) -> tuple[str, dict]:
    """
    Force outbound connection over IPv4 while keeping the hostname for TLS/SNI:
    - Append `hostaddr=<IPv4>` to the DSN query string (so libpq definitely sees it)
    - Also pass `hostaddr` via connect_args as a backup
    """
    host = urlparse(url).hostname
    connect_args = {"sslmode": "require", "connect_timeout": 5}
    try:
        ipv4 = socket.getaddrinfo(host, None, family=socket.AF_INET)[0][4][0]
        # Append hostaddr to the DSN itself
        sep = "&" if "?" in url else "?"
        url = f"{url}{sep}hostaddr={ipv4}"
        # Also pass via connect_args (double assurance)
        connect_args["hostaddr"] = ipv4
        if os.getenv("DEBUG_DB") == "1":
            print(f"[DB] Using IPv4 hostaddr={ipv4} for host={host}")
    except Exception as e:
        if os.getenv("DEBUG_DB") == "1":
            print(f"[DB] IPv4 resolution failed for host={host}: {e} (falling back to URL as-is)")
    return url, connect_args

DSN, CONNECT_ARGS = add_ipv4_hostaddr(BASE_URL)

engine = create_engine(
    DSN,
    connect_args=CONNECT_ARGS,   # force IPv4 + TLS
    pool_pre_ping=True,          # avoid stale connections
    pool_recycle=1800,           # recycle every 30 min
    pool_size=5,
    max_overflow=5,
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()
