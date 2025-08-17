import os,sys
from celery import Celery
from dotenv import load_dotenv
from celery.schedules import timedelta
#sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)
# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
# Create Celery app
app = Celery(
    "internship_screening",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['backend.tasks.resume_processing', 'backend.tasks.email_batch']
)
# Celery configuration
app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='America/New_York',
    enable_utc=True,
    # Retry configuration
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)
# change time delta
app.conf.beat_schedule = {
    "send-emails-every-48-hours": {
        "task": "backend.tasks.email_batch.batch_send_stage_emails",
        "schedule": timedelta(hours=48),
    },
}
