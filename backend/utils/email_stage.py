import os, sys
import smtplib
import json # Add this import to handle the new JSON file
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.utils.calendly import get_slots, get_primary_url, format_team

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "..", "templates")
# Load the new Calendly links data file
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
with open(os.path.join(DATA_DIR, "calendly_links.json"), 'r') as f:
    CALENDLY_LINKS = json.load(f)
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))


# Basic config
EMAIL_SENDER = os.getenv("EMAIL_USER")
EMAIL_PASSWORD = os.getenv("EMAIL_PASS")
SMTP_SERVER = os.getenv("EMAIL_HOST")
SMTP_PORT = os.getenv("EMAIL_PORT")

# Toggle to True for development (terminal) testing
DEV_MODE = os.getenv("DEV_MODE", "False").lower() == "true"

def render_template(template_name, **kwargs):
    template = env.get_template(template_name)
    return template.render(**kwargs)

def send_email(to_email, subject, html_body):
    if DEV_MODE:
        print("----- DEV EMAIL -----")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(html_body)
        print("----------------------")
        return

    msg = MIMEText(html_body, "html")
    msg["Subject"] = subject
    msg["From"] = EMAIL_SENDER
    msg["To"] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, [to_email], msg.as_string())
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

# Specific email functions

def send_interview1_email(application):
    subject = "Interview Invitation - Teens4Teens Internship"
    team = application.team_applied
    slots = get_slots(team, "round1")
    html = render_template(
        "interview_1.html",
        name=application.user.full_name,
        team_name=format_team(team),
        slots=slots,
        primary_link=get_primary_url(team, "round1"),
    )
    send_email(application.user.email, subject, html)

def send_interview2_email(application):
    subject = "Second Round Interview - Teens4Teens"
    team = application.team_applied
    slots = get_slots(team, "round2")
    html = render_template(
        "interview_2.html",
        name=application.user.full_name,
        team_name=format_team(team),
        slots=slots,
        primary_link=get_primary_url(team, "round2"),
    )
    send_email(application.user.email, subject, html)

def send_offer_email(application):
    subject = "🎉 You're In! Teens4Teens Internship Offer"
    html_body = render_template("offer.html", name=application.user.full_name)
    send_email(application.user.email, subject, html_body)

def send_rejection_email(application):
    subject = "Application Update - Teens4Teens"
    html_body = render_template("rejection.html", name=application.user.full_name)
    send_email(application.user.email, subject, html_body)