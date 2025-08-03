import os
import smtplib
import json # Add this import to handle the new JSON file
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader


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
    html_body = render_template("interview_1.html", name=application.user.full_name)
    send_email(application.user.email, subject, html_body)


def send_interview2_email(application):
    subject = "Second Round Interview - Teens4Teens"
    
    # Get the team the applicant applied to
    team = application.team_applied
    
    # Select the correct Calendly link for that team, or use the default
    calendly_link = CALENDLY_LINKS.get(team, CALENDLY_LINKS["default"])

    team_name_formatted = team.replace('_', ' ').title()
    # Pass the specific calendly_link to the template
    html_body = render_template("interview_2.html", name=application.user.full_name, calendly_link=calendly_link, team_name=team_name_formatted)
    
    send_email(application.user.email, subject, html_body)


def send_offer_email(application):
    subject = "🎉 You're In! Teens4Teens Internship Offer"
    html_body = render_template("offer.html", name=application.user.full_name)
    send_email(application.user.email, subject, html_body)

def send_rejection_email(application):
    subject = "Application Update - Teens4Teens"
    html_body = render_template("rejection.html", name=application.user.full_name)
    send_email(application.user.email, subject, html_body)