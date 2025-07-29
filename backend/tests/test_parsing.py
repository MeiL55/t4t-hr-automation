import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.models.database import SessionLocal
from backend.services.screening import parse_resume_keywords, calculate_keyword_score
from backend.services.s3_upload import score_from_s3

def test_parse_oz_resume():
    parsed = parse_resume_keywords("cv.pdf")
    isempty = parsed is None
    score = calculate_keyword_score(parsed, "software")
    #print("parsed data is empty", isempty)
    #print("Parsed resume data:", parsed)
    print("Score:", score)

#test_parse_oz_resume()
score_from_s3("cv_for_coop (3).pdf", "software")