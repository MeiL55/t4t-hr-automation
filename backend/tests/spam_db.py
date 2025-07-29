import threading
import requests
import random
import time

TOKENS = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJlbWFpbCI6Im1saTc4M0BnYXRlY2guZWR1Iiwicm9sZSI6ImFwcGxpY2FudCIsImV4cCI6MTc1Mzc3NDg5OX0.te2bQ0FSTSlXZIAKboLATDn__rHjfi1-0b6WuzmYUVI",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJlbWFpbCI6Im1heWF5YXlheTlAZ21haWwuY29tIiwicm9sZSI6ImFwcGxpY2FudCIsImV4cCI6MTc1Mzc3NDkzN30.s2qrjLE7Da45GeQz7XkUSKoutfq8Ckkmoc4N6tsfTWc",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMSwiZW1haWwiOiJwcml2YXRlbG1AMTYzLmNvbSIsInJvbGUiOiJhcHBsaWNhbnQiLCJleHAiOjE3NTM3NzUxMTl9.nzWofDq-394NW4QKFWLzURKQyHbYikzR6sP-BCMM0Gg",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwiZW1haWwiOiJpYW1sbTA1MTBAMTYzLmNvbSIsInJvbGUiOiJhcHBsaWNhbnQiLCJleHAiOjE3NTM3NzUxNTd9.WhSflCt0swRJFfyQfz7w5k-QgKZ3bCz7FbI5_-T_1is",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMiwiZW1haWwiOiJyYW5kb21kZXYxMjVAZ21haWwuY29tIiwicm9sZSI6ImFwcGxpY2FudCIsImV4cCI6MTc1Mzc3NTIyMH0.fGtAIfnWGYvhI1F0BiVcranyXAOrr_ZbH2Hx3agfuxA",

]

API_URL = "http://127.0.0.1:5000/api/application"

def submit_application(token, idx):
    fake_resume = f"{idx}_resume.pdf"
    data = {
        "date_of_birth": "2005-01-01",
        "resume_filename": fake_resume,
        "gpa": round(random.uniform(3.5, 4.0), 2),
        "us_based": True,
        "has_criminal_record": False,
        "education_level": "bachelors",
        "school": "MIT",
        "team_applied": "software",
        "guardian_phone": "1234567890"
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers)
        print(f"[{idx}] Status: {response.status_code}, Response: {response.json()}")
    except Exception as e:
        print(f"[{idx}] ERROR: {e}")

# Create threads
threads = []
for i, token in enumerate(TOKENS):
    t = threading.Thread(target=submit_application, args=(token, i+1))
    threads.append(t)

# Start threads
for t in threads:
    t.start()
    time.sleep(0.1)  # slight delay to stagger start times

# Wait for all to finish
for t in threads:
    t.join()