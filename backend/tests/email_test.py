import sys,os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.celery_app import app
from backend.tasks.email_batch import batch_send_stage_emails

result = batch_send_stage_emails.delay()
print("Batch email task enqueued.")
print(result.get(timeout=10))