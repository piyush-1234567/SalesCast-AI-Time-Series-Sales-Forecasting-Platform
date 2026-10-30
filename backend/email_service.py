import os
import httpx
from dotenv import load_dotenv

load_dotenv()

async def send_reset_email(to_email: str, reset_link: str):
    api_key = os.getenv("BREVO_API_KEY")

    if not api_key:
        raise RuntimeError("BREVO_API_KEY is not configured")

    payload = {
        "sender": {
            "name": "SalesCast AI",
            "email": "piyushjain07032004@gmail.com"
        },
        "to": [{"email": to_email}],
        "subject": "SalesCast AI - Reset Your Password",
        "textContent": (
            f"Click this link to reset your password: {reset_link}\n"
            "If you didn't request this, ignore this email."
        )
    }

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(
            "https://api.brevo.com/v3/smtp/email",
            headers={
                "api-key": api_key,
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            json=payload
        )
        response.raise_for_status()

    print("Reset email sent successfully")