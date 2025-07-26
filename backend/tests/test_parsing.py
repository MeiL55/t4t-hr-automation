import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.services.screening import parse_resume

def test_parse_oz_resume():
    parsed = parse_resume("oz_resume.pdf")
    isempty = parsed is None
    print("parsed data is empty", isempty)
    print("Parsed resume data:", parsed)

test_parse_oz_resume()