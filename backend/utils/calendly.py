from __future__ import annotations
import os, json
from pathlib import Path
from typing import Any, Dict, List



_CFG_PATH = Path(__file__).resolve().parent.parent / "data" / "calendly_links.json"
_LINKS: Dict[str, Any] = json.loads(_CFG_PATH.read_text(encoding="utf-8"))

STRICT = os.getenv("CALENDLY_STRICT", "false").lower() == "true"

def format_team(team: str | None) -> str:
    return (team or "general").replace("_", " ").title()

def _normalize(val: Any) -> List[Dict[str, str]]:
    if isinstance(val, list):
        return val
    if isinstance(val, str):
        return [{"label": "Schedule", "owner": "", "url": val}]
    return []

def get_slots(team: str | None, round_key: str) -> List[Dict[str, str]]:
    key = (team or "").strip().lower()
    node = _LINKS.get(key) or {}
    return _normalize(node.get(round_key))

def get_primary_url(team: str | None, round_key: str) -> str | None:
    s = get_slots(team, round_key)
    return s[0]["url"] if s else None

def assert_slots(team: str | None, round_key: str) -> List[Dict[str, str]]:
    s = get_slots(team, round_key)
    if STRICT and not s:
        raise RuntimeError(f"Calendly slots missing for team={team!r} round={round_key!r}")
    return s