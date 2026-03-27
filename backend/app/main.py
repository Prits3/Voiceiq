from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import init_db
from app.routes import auth, campaigns, calls, leads, phone_numbers, voices, voice_webhook


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    init_db()
    yield
    # Shutdown: nothing to clean up for SQLite


app = FastAPI(
    title="VoiceIQ",
    description="AI-powered outbound calling platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
import os

_cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(campaigns.router)
app.include_router(leads.router)
app.include_router(calls.router)
app.include_router(phone_numbers.router)
app.include_router(voices.router)
app.include_router(voice_webhook.router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "VoiceIQ API"}
