# VoiceIQ

AI-powered outbound calling platform. Create campaigns, import leads, and let an AI agent make calls on your behalf — with natural-sounding voice, live transcripts, and call analytics.

---

## Features

- **AI Outbound Calls** — GPT-powered agent follows your campaign script and responds naturally to prospects
- **Natural Voice** — Google Neural TTS (Journey) via Twilio; upgradeable to Vapi for human-level voice
- **Campaign Management** — Create campaigns with custom scripts and voice profiles
- **Lead Management** — Import leads via CSV, track call status per lead
- **Call Analytics** — Live transcripts, call duration, recording URLs, sentiment analysis
- **Voice Profiles** — Configure ElevenLabs or OpenAI TTS voices per campaign
- **Phone Number Management** — Buy and manage Twilio numbers from the dashboard
- **Founder Notifications** — Email alert on every new signup, with Vapi upgrade reminder
- **Dark UI** — Clean, modern dark theme throughout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, SQLite |
| Calls | Twilio (outbound dialing + Google Neural TTS) |
| AI Agent | OpenAI GPT-4o-mini |
| TTS (optional) | ElevenLabs, OpenAI TTS |
| Voice AI (upgrade) | Vapi |
| STT | Deepgram / Groq Whisper |
| Auth | JWT |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- A [Twilio](https://twilio.com) account with a phone number

### 1. Clone the repo

```bash
git clone <repo-url>
cd voiceiq
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Copy and fill in the environment file:

```bash
cp ../.env.example .env
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL=sqlite:///./voiceiq.db

# Auth
SECRET_KEY=change-this-in-production

# Twilio (required for calls)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# OpenAI (required for AI agent)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Groq (optional — faster/cheaper LLM + STT)
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_STT_MODEL=whisper-large-v3-turbo

# ElevenLabs (optional — premium TTS voices)
ELEVENLABS_API_KEY=

# Deepgram (optional — STT)
DEEPGRAM_API_KEY=

# Vapi (optional — human-sounding voice AI, replaces Twilio TTS)
VAPI_API_KEY=
VAPI_PHONE_NUMBER_ID=

# Email notifications (optional — get emailed on every signup)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Gmail App Password
FOUNDER_EMAIL=yourgmail@gmail.com

# App
BASE_URL=https://your-backend-url.com
ENVIRONMENT=development
```

---

## Voice Configuration

VoiceIQ has three voice tiers:

### Demo (default — no extra setup)
Uses **Google Neural TTS** (`Google.en-US-Journey-F`) via Twilio's built-in `<Say>` verb. Natural, Alexa-quality voice. Free within your Twilio usage.

### Premium TTS (ElevenLabs / OpenAI)
Set `ELEVENLABS_API_KEY` or `OPENAI_API_KEY` and configure a Voice Profile in the dashboard. Used for TTS outside of live calls.

### Human-level Voice AI (Vapi — recommended for production)
1. Create an account at [vapi.ai](https://vapi.ai)
2. Import your Twilio number (Vapi Dashboard → Phone Numbers → Import)
3. Copy your **API Key** and **Phone Number ID**
4. Add to `.env`: `VAPI_API_KEY` and `VAPI_PHONE_NUMBER_ID`
5. Set your Vapi server URL to `https://your-backend/webhook/vapi/events`
6. Restart the backend

When `VAPI_API_KEY` is set, all calls automatically route through Vapi with ElevenLabs Rachel voice. Falls back to Twilio if unset.

---

## Founder Email Notifications

When a new user signs up, VoiceIQ emails you at `FOUNDER_EMAIL` with:
- Their email address and signup time
- A reminder to upgrade to Vapi when you're ready

Uses Gmail SMTP with an App Password. To generate one:
1. Google Account → Security → 2-Step Verification → App Passwords
2. Create one named "VoiceIQ"
3. Paste the 16-character code as `SMTP_PASSWORD`

---

## Deployment

### Backend → Railway

1. Connect your GitHub repo to [Railway](https://railway.app)
2. Set all environment variables in Railway's dashboard
3. Railway auto-deploys on push to `main`

### Frontend → Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set `NEXT_PUBLIC_API_URL=https://your-railway-backend-url.com`
3. Vercel auto-deploys on push to `main`

---

## Project Structure

```
voiceiq/
├── backend/
│   └── app/
│       ├── core/           # Config, database, security
│       ├── models/         # SQLAlchemy models
│       ├── routes/         # API endpoints + webhooks
│       ├── schemas/        # Pydantic schemas
│       └── services/       # Business logic (calls, TTS, AI, email)
├── frontend/
│   ├── app/                # Next.js app router pages
│   └── components/         # UI components
└── README.md
```

---

## Roadmap

- [ ] Vapi integration (human-level voice)
- [ ] Stripe billing + subscription management
- [ ] Real-time call monitoring dashboard
- [ ] CRM integrations (HubSpot, Salesforce)
- [ ] Multi-language support
- [ ] A/B testing for scripts
