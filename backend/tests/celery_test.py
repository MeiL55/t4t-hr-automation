import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.tasks.resume_processing import process_resume_and_screen
# Replace this with a real application ID that exists in your DB
application_id = 15

# Enqueue the task
result = process_resume_and_screen.delay(application_id)

print(f"Task enqueued with ID: {result.id}")
print("Waiting for result...")
print(result.get(timeout=10))