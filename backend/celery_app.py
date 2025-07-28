import os
from celery import Celery
from dotenv import load_dotenv
# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path)
# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
# Create Celery app
celery_app = Celery(
    "internship_screening",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=['backend.tasks.resume_processing', 'backend.tasks.email_batch']
)
# Celery configuration
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    # Retry configuration
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)