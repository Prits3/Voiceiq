import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

from app.core.config import settings


def _send(to: str, subject: str, html: str) -> None:
    """Send an email via SMTP. Silently no-ops if SMTP is not configured."""
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM or settings.SMTP_USER
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(msg["From"], to, msg.as_string())


def notify_new_signup(user_email: str) -> None:
    """Notify the founder when a new user signs up."""
    founder_email = settings.FOUNDER_EMAIL
    if not founder_email:
        return

    vapi_needed = not bool(getattr(settings, "VAPI_API_KEY", ""))
    vapi_section = ""
    if vapi_needed:
        vapi_section = """
        <div style="margin-top:20px;padding:16px;background:#fef9c3;border-left:4px solid #eab308;border-radius:6px;">
            <strong>⚡ Ready to upgrade?</strong><br/>
            You're currently running on Google Neural TTS (demo mode).<br/>
            When you're ready, add <code>VAPI_API_KEY</code> + <code>VAPI_PHONE_NUMBER_ID</code> to your .env
            to unlock fully human-sounding AI calls via Vapi.
        </div>
        """

    html = f"""
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#7c3aed;">🎉 New VoiceIQ Signup!</h2>
        <p>Someone just created an account on your platform.</p>
        <table style="width:100%;border-collapse:collapse;margin-top:12px;">
            <tr>
                <td style="padding:8px 12px;background:#f3f4f6;font-weight:600;">Email</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">{user_email}</td>
            </tr>
            <tr>
                <td style="padding:8px 12px;background:#f3f4f6;font-weight:600;">Time</td>
                <td style="padding:8px 12px;">{datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")}</td>
            </tr>
        </table>
        {vapi_section}
        <p style="margin-top:24px;color:#6b7280;font-size:13px;">VoiceIQ · Automated notification</p>
    </div>
    """

    _send(
        to=founder_email,
        subject=f"🎉 New VoiceIQ signup: {user_email}",
        html=html,
    )
