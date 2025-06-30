import smtplib
import os
import logging
from dotenv import load_dotenv
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# ✅ Load environment variables
load_dotenv()

# ✅ Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ Configurable frontend URL for reset link
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def send_reset_email(to_email: str, token: str) -> bool:
    sender_email = os.getenv("EMAIL_ADDRESS")
    sender_password = os.getenv("EMAIL_APP_PASSWORD")

    if not sender_email or not sender_password:
        logger.error("❌ Email credentials not set in environment")
        return False

    reset_link = f"{FRONTEND_URL}/reset-password/{token}"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset Request"
    message["From"] = sender_email
    message["To"] = to_email

    html = f"""
    <html>
      <body>
        <p>Hi,<br>
           You requested a password reset for your account.<br><br>
           <a href="{reset_link}">Click here to reset your password</a><br><br>
           This link is valid for 30 minutes.
        </p>
      </body>
    </html>
    """
    message.attach(MIMEText(html, "html"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
        server.quit()
        logger.info(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to send email: {e}")
        return False
