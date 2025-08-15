# backend/db.py
import os
import socket
from urllib.parse import urlparse
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env (works locally; on Railway/Vercel the platform injects env vars)
load_dotenv(find_dotenv())

# Prefer the official Supabase SQLAlchemy URL as SUPABASE_DB_URL_BASE
# Fallback to SUPABASE_DB_URL for backward compatibility.
# Recommended format (from Supabase console):
# postgresql+psycopg2://postgres:<PASSWORD>@db.<REF>.supabase.co:5432/postgres?sslmode=require&connect_timeout=5
BASE_URL = os.getenv("SUPABASE_DB_URL_BASE") or os.getenv("SUPABASE_DB_URL")

if not BASE_URL:
    # Fail fast if the database URL is missing so misconfigurations are obvious in logs
    raise RuntimeError(
        "Missing SUPABASE_DB_URL_BASE or SUPABASE_DB_URL. "
        "Copy the SQLAlchemy connection string from Supabase (with sslmode=require)."
    )

def build_dsn_with_ipv4(url: str) -> tuple[str, dict]:
    """
    Build a DSN that keeps the hostname (for TLS/SNI + cert validation)
    but forces the TCP connection over IPv4 using psycopg2's 'hostaddr'.
    This avoids 'Network is unreachable' when the runtime lacks outbound IPv6.

    Returns:
        (dsn, connect_args) — pass both to SQLAlchemy's create_engine().
    """
    try:
        host = urlparse(url).hostname
        # Resolve only IPv4 (A record). If resolution fails, we fall back gracefully below.
        ipv4 = socket.getaddrinfo(host, None, family=socket.AF_INET)[0][4][0]
        connect_args = {
            "sslmode": "require",        # enforce TLS
            "connect_timeout": 5,        # quick failover on bad networks
            "hostaddr": ipv4,            # force IPv4 while preserving 'host' for TLS
        }
    except Exception:
        # If IPv4 resolution fails, still enforce TLS & timeout and let libpq decide the route
        connect_args = {"sslmode": "require", "connect_timeout": 5}
    return url, connect_args

# Final DSN + connection arguments (IPv4 + SSL)
DSN, CONNECT_ARGS = build_dsn_with_ipv4(BASE_URL)

# Create a shared SQLAlchemy engine with a resilient pool
engine = create_engine(
    DSN,
    connect_args=CONNECT_ARGS,  # <- force IPv4 + TLS
    pool_pre_ping=True,         # ping connections before use to avoid stale/broken pipes
    pool_recycle=1800,          # recycle connections every 30 min (many clouds drop idle conns)
    pool_size=5,                # tune for your workload
    max_overflow=5,             # allow short bursts beyond pool_size
)

# Standard session factory and declarative base for ORM models
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Usage notes:
# - Import 'engine', 'SessionLocal', and 'Base' from this module everywhere.
# - Do NOT create other engines elsewhere—keep a single, shared engine.
# - On Railway, set SUPABASE_DB_URL_BASE in the service variables to the Supabase SQLAlchemy URL
#   (with ?sslmode=require&connect_timeout=5). This module handles IPv4 forcing automatically.
