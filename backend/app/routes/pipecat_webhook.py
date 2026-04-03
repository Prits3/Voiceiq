"""
Pipecat + Twilio Media Streams integration.

Endpoints:
  POST /pipecat/twiml/{token}   — Twilio calls this on outbound answer;
                                   returns TwiML that opens a WebSocket stream
  WS   /pipecat/ws/{token}      — Twilio streams real-time audio here;
                                   Pipecat pipeline runs inside
"""
import json
import uuid

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import Response
from loguru import logger

router = APIRouter(prefix="/pipecat", tags=["pipecat"])

# In-memory session store: token → {lead_name, script, voice}
# Entries are consumed (deleted) when the WebSocket connects.
_sessions: dict[str, dict] = {}


def create_pipecat_session(lead_name: str, script: str, voice: str = "af_heart") -> str:
    """Called by call_service before dialling; returns a one-use token."""
    token = uuid.uuid4().hex
    _sessions[token] = {"lead_name": lead_name, "script": script, "voice": voice}
    return token


@router.post("/twiml/{token}")
async def twiml_connect(token: str, request: Request):
    """
    Twilio hits this URL when the outbound call is answered.
    We return TwiML that tells Twilio to open a bidirectional Media Stream
    WebSocket to /pipecat/ws/{token}.
    """
    # Build WebSocket URL from the request's base URL
    base = str(request.base_url).rstrip("/")
    ws_base = base.replace("https://", "wss://").replace("http://", "ws://")
    ws_url = f"{ws_base}/pipecat/ws/{token}"

    twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="{ws_url}" />
  </Connect>
</Response>"""
    return Response(content=twiml, media_type="text/xml")


@router.websocket("/ws/{token}")
async def pipecat_ws(websocket: WebSocket, token: str):
    """
    Twilio Media Streams WebSocket.
    1. Accept the connection
    2. Read Twilio's start event to get stream_sid and call_sid
    3. Launch the Pipecat pipeline
    """
    await websocket.accept()

    session = _sessions.pop(token, {})
    lead_name = session.get("lead_name", "")
    script = session.get("script", "")
    voice = session.get("voice", "af_heart")

    # Twilio sends a "connected" message then a "start" message before any audio.
    # We need the start message to get stream_sid and call_sid.
    stream_sid = ""
    call_sid = ""

    try:
        for _ in range(10):  # read up to 10 messages to find the start event
            raw = await websocket.receive_text()
            msg = json.loads(raw)
            if msg.get("event") == "start":
                stream_sid = msg["start"]["streamSid"]
                call_sid = msg["start"]["callSid"]
                logger.info(f"[Pipecat WS] start event — stream={stream_sid} call={call_sid}")
                break
    except Exception as exc:
        logger.error(f"[Pipecat WS] failed to read start event: {exc}")
        return

    if not stream_sid:
        logger.error("[Pipecat WS] no start event received — closing")
        return

    try:
        from app.services.pipecat_bot import run_pipecat_bot
        await run_pipecat_bot(
            websocket=websocket,
            stream_sid=stream_sid,
            call_sid=call_sid,
            lead_name=lead_name,
            campaign_script=script,
            voice=voice,
        )
    except WebSocketDisconnect:
        logger.info("[Pipecat WS] WebSocket disconnected")
    except Exception as exc:
        logger.error(f"[Pipecat WS] pipeline error: {exc}")
