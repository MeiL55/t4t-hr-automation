# test_email.py
import os, sys
from unittest.mock import Mock
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
os.environ["DEV_MODE"] = "True"
from backend.utils.email_stage import send_interview2_email

user = Mock()
user.email = "mayayayay9@gmail.com"
user.full_name = "May Li"

application = Mock()
application.team_applied = "software"
application.user = user

send_interview2_email(application)