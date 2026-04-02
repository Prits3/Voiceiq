from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./voiceiq.db"

    # Auth
    SECRET_KEY: str = "supersecret-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Twilio
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GROQ_STT_MODEL: str = "whisper-large-v3-turbo"

    # OpenAI (optional, kept for other services)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Kokoro-Web (self-hosted TTS — primary voice engine for calls)
    KOKORO_BASE_URL: str = ""       # e.g. https://kokoro-xxx.railway.app/api/v1
    KOKORO_API_KEY: str = ""        # the KW_SECRET_API_KEY you set when deploying Kokoro

    # Azure Neural TTS (fallback if Kokoro is down)
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "westeurope"

    # Vapi (voice AI — replaces Twilio TwiML for call execution)
    VAPI_API_KEY: str = ""
    VAPI_PHONE_NUMBER_ID: str = ""  # Vapi phone number ID (import your Twilio number in Vapi dashboard)

    # ElevenLabs
    ELEVENLABS_API_KEY: str = ""

    # Deepgram
    DEEPGRAM_API_KEY: str = ""

    # Email notifications (use Gmail + App Password, or any SMTP)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""    # Gmail: use an App Password, not your real password
    SMTP_FROM: str = ""        # optional display name <email>, defaults to SMTP_USER
    FOUNDER_EMAIL: str = ""    # where to send signup notifications

    # App
    BASE_URL: str = "https://your-app.example.com"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()
