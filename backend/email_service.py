import os
import aiosmtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

async def send_reset_email(to_email: str, reset_link: str):
    message = EmailMessage()
    message["From"] = "piyushjain07032004@gmail.com"
    message["To"] = to_email
    message["Subject"] = "SalesCast AI - Reset Your Password"
    message.set_content(
        f"Click this link to reset your password: {reset_link}\n"
        "If you didn't request this, ignore this email."
    )

    await aiosmtplib.send(
        message,
        hostname=os.getenv("SMTP_SERVER"),
        port=int(os.getenv("SMTP_PORT", 587)),
        username=os.getenv("SMTP_LOGIN"),
        password=os.getenv("SMTP_PASSWORD"),
        start_tls=True,
    )
    print("Reset email sent successfully")