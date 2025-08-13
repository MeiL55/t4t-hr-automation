# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

WORKDIR /app

# install deps
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy the backend package into /app/backend (keep the package name!)
COPY . /app/backend

EXPOSE 8080

# gunicorn in prod; PORT is injected by Railway
CMD ["sh","-c","gunicorn -w 2 -k gthread --threads 8 -b 0.0.0.0:${PORT:-8080} backend.app:app"]
