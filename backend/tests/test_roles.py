import sys
import os
import json
from datetime import date
from sqlalchemy.orm import Session
from io import BytesIO
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.user import User
from backend.models.application import Application
from backend.services.screening import screen_keyword_requirements
from backend.services.screening import calculate_keyword_score
from pdfminer.high_level import extract_text
from typing import Optional

import os
import pytest

from backend.services.screening import calculate_keyword_score

# Path to the sample PDF
PDF_PATH = os.path.join(os.path.dirname(__file__), "cv_data.pdf")

@pytest.fixture
def pdf_bytes():
    with open(PDF_PATH, "rb") as f:
        return f.read()

def test_calculate_keyword_score_software(pdf_bytes):
    """Test keyword scoring for the outreach role."""
    score = calculate_keyword_score(pdf_bytes, role="software")
    print(score)
    assert isinstance(score, int)
    # score should be >= 0
    assert score >= 0

def test_calculate_keyword_score_invalid_role(pdf_bytes):
    """Test behavior when role is not in role_keywords.json."""
    score = calculate_keyword_score(pdf_bytes, role="nonexistent_role")
    # Should return 0 if no keywords are defined
    assert score == 0

