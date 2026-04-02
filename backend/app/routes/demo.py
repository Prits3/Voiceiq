"""
Public demo endpoints — no auth required.

GET  /demo/health          sanity check
POST /demo/generate        Groq-generated cold-call script (quick demo)
POST /demo/live/start      begin a live interactive call → AI greeting text
POST /demo/live/respond    user audio → Groq Whisper → Groq LLM → text response
POST /demo/vapi/llm        OpenAI-compatible endpoint for Vapi custom LLM (Groq brain)

TTS is handled on the frontend via the browser Web Speech API (quick demo)
and by Vapi itself (live call).
"""
import io
import json
import time

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from pydantic import BaseModel

from groq import AsyncGroq

from app.core.config import settings
from app.services.tts_service import tts_service

router = APIRouter(prefix="/demo", tags=["demo"])

# ── language map ────────────────────────────────────────────────────────────

LANG_MAP: dict[str, str] = {
    "en": "English",
    "de": "German",
    "ar": "Arabic",
}

WHISPER_LANG: dict[str, str] = {
    "en": "en",
    "de": "de",
    "ar": "ar",
}

# ── Schemas ─────────────────────────────────────────────────────────────────


class GenerateRequest(BaseModel):
    product: str
    voice: str = "female"    # kept for frontend compatibility
    language: str = "en"


class LiveStartRequest(BaseModel):
    product: str
    voice: str = "female"
    language: str = "en"


# ── helper ──────────────────────────────────────────────────────────────────

def _client() -> AsyncGroq:
    if not settings.GROQ_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="GROQ_API_KEY not configured",
        )
    return AsyncGroq(api_key=settings.GROQ_API_KEY)


# ── Routes ──────────────────────────────────────────────────────────────────


class TTSRequest(BaseModel):
    text: str
    voice: str = "af_heart"   # Kokoro voice — af_heart = warm American female


@router.post("/tts")
async def demo_tts(req: TTSRequest):
    """
    Generate speech audio via Kokoro-Web (falls back to Azure).
    Returns MP3 bytes — consumed by the frontend to replace browser speechSynthesis.
    """
    text = req.text.strip()[:500]  # cap at 500 chars for demo safety
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    audio = await tts_service.synthesize_for_call(text, voice=req.voice)
    if not audio:
        raise HTTPException(status_code=503, detail="TTS providers unavailable")

    return Response(content=audio, media_type="audio/mpeg")


@router.get("/health")
def demo_health():
    return {"ok": True, "groq_configured": bool(settings.GROQ_API_KEY)}


@router.post("/generate")
async def generate_demo(req: GenerateRequest):
    """
    Generate a realistic cold-call conversation using Groq.
    Returns 503 so the frontend can fall back to its scripted demo.
    """
    client = _client()
    lang_name = LANG_MAP.get(req.language, "English")

    prompt = f"""Simulate a realistic phone cold call between Alex (a warm, human sales rep) and a prospect.

Product being sold: {req.product.strip()[:200]}
Language: Write the ENTIRE conversation in {lang_name}.

Requirements:
- 6 to 8 exchanges total
- Very short, natural sentences — this is a phone call, not an email
- Alex sounds like a real person: uses contractions, occasional "you know" or "honestly", never corporate speak
- Prospect shows mild hesitation or distraction at first
- Include one realistic objection (e.g. "I'm too busy", "already have a solution", "not sure about price")
- Alex handles it with empathy and pivots naturally to value
- End with prospect agreeing to a next step (demo, follow-up call, or details by email)

Output ONLY in this exact format — one line per exchange, nothing else:
AI: [what Alex says]
Customer: [what the prospect says]"""

    try:
        response = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=700,
            temperature=0.85,
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Groq error: {str(exc)}")

    raw = response.choices[0].message.content.strip()
    lines = []
    for raw_line in raw.splitlines():
        stripped = raw_line.strip()
        if stripped.startswith("AI:"):
            lines.append({"role": "AI", "text": stripped[3:].strip(), "voice": None})
        elif stripped.startswith("Customer:"):
            lines.append({"role": "Customer", "text": stripped[9:].strip(), "voice": None})

    if not lines:
        raise HTTPException(status_code=500, detail="Failed to parse conversation")

    return {"lines": lines, "source": "ai"}


@router.post("/live/start")
async def live_start(req: LiveStartRequest):
    """
    Begin a live interactive call.
    Returns the AI's opening greeting as text — TTS is done on the frontend.
    """
    client = _client()
    lang_name = LANG_MAP.get(req.language, "English")

    prompt = (
        f"You are Alex, a friendly sales rep making a cold call about: {req.product.strip()[:200]}. "
        f"Generate ONLY your natural opening line — the very first thing you say when someone picks up. "
        f"Sound like a real human: warm, relaxed, confident. Use contractions. Max 2 short sentences. "
        f"Respond entirely in {lang_name}."
    )

    try:
        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=80,
            temperature=0.7,
        )
        greeting = resp.choices[0].message.content.strip()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    return {"ai_text": greeting}


@router.post("/live/respond")
async def live_respond(
    audio: UploadFile = File(...),
    history: str = Form("[]"),
    voice: str = Form("female"),
    language: str = Form("en"),
    product: str = Form(""),
):
    """
    Accepts user audio, transcribes via Groq Whisper,
    generates AI response via Groq LLM.
    Returns user_text + ai_text as JSON — TTS done on the frontend.
    """
    client = _client()
    lang_name = LANG_MAP.get(language, "English")
    whisper_lang = WHISPER_LANG.get(language)

    # 1. Groq Whisper STT ─────────────────────────────────────────────────────
    audio_bytes = await audio.read()
    ext = (audio.filename or "recording.webm").rsplit(".", 1)[-1]
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = f"recording.{ext}"

    try:
        whisper_kwargs: dict = {
            "model": settings.GROQ_STT_MODEL,
            "file": (audio_file.name, audio_file, "audio/webm"),
            "response_format": "json",
        }
        if whisper_lang:
            whisper_kwargs["language"] = whisper_lang

        transcription = await client.audio.transcriptions.create(**whisper_kwargs)
        user_text = transcription.text.strip()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Transcription error: {str(exc)}")

    if not user_text:
        raise HTTPException(
            status_code=400,
            detail="Could not transcribe audio — speak clearly and try again",
        )

    # 2. Groq LLM response ────────────────────────────────────────────────────
    try:
        hist: list = json.loads(history)
    except Exception:
        hist = []

    system_msg = (
        f"You are Alex, a friendly human sales rep on a live cold call about: "
        f"{product.strip()[:200] if product else 'our product'}. "
        "Sound warm, natural and conversational — like a real person, not a bot. "
        "Use contractions (you're, we've, that's), occasional filler words ('you know', 'actually', 'honestly'), "
        "and short natural sentences. Max 1–2 sentences per response. "
        "Handle objections empathetically and guide towards a demo or next step. "
        f"Respond ONLY in {lang_name}. Never mention being an AI unless directly asked."
    )

    messages: list = [{"role": "system", "content": system_msg}]
    for h in hist[-10:]:
        if h.get("role") == "AI":
            messages.append({"role": "assistant", "content": h["text"]})
        elif h.get("role") == "User":
            messages.append({"role": "user", "content": h["text"]})
    messages.append({"role": "user", "content": user_text})

    try:
        gpt_resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            max_tokens=150,
            temperature=0.7,
        )
        ai_text = gpt_resp.choices[0].message.content.strip()
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"AI error: {str(exc)}")

    return {"user_text": user_text, "ai_text": ai_text}


# ── Vapi custom LLM endpoint (Groq brain) ───────────────────────────────────

class VapiLLMRequest(BaseModel):
    model: str = "llama-3.3-70b-versatile"
    messages: list[dict]
    max_tokens: int = 250
    temperature: float = 0.7
    stream: bool = False


@router.post("/vapi/llm")
async def vapi_llm(req: VapiLLMRequest):
    """
    OpenAI-compatible chat completions endpoint consumed by Vapi as a Custom LLM.
    Vapi sends the full conversation here; we forward it to Groq and return
    the response in OpenAI format so Vapi can convert it to speech.
    """
    client = _client()

    # Ensure there is a system message. Vapi injects one if you configured
    # a system prompt in the dashboard (with {{product}} already substituted).
    # If none exists, provide a sensible default.
    has_system = any(m.get("role") == "system" for m in req.messages)
    messages = req.messages
    if not has_system:
        messages = [
            {
                "role": "system",
                "content": (
                    "You are Alex, a warm and friendly sales rep on a live cold call. "
                    "Sound natural and human — use contractions, occasional filler words like 'honestly' or 'you know', "
                    "and keep responses to 1–2 short sentences. "
                    "Handle objections empathetically and guide the prospect toward a demo or next step. "
                    "Never sound scripted or robotic. Never mention being an AI unless directly asked."
                ),
            },
            *messages,
        ]

    try:
        response = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=messages,
            max_tokens=req.max_tokens,
            temperature=req.temperature,
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Groq error: {str(exc)}")

    choice = response.choices[0]
    usage = response.usage

    return {
        "id": response.id,
        "object": "chat.completion",
        "created": int(time.time()),
        "model": settings.GROQ_MODEL,
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": choice.message.content,
                },
                "finish_reason": choice.finish_reason or "stop",
            }
        ],
        "usage": {
            "prompt_tokens": usage.prompt_tokens if usage else 0,
            "completion_tokens": usage.completion_tokens if usage else 0,
            "total_tokens": usage.total_tokens if usage else 0,
        },
    }
