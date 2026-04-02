import httpx

from app.core.config import settings

VAPI_BASE_URL = "https://api.vapi.ai"


class VapiService:
    """Vapi voice AI service for human-sounding outbound calls."""

    def __init__(self):
        self.api_key = settings.VAPI_API_KEY
        self.phone_number_id = settings.VAPI_PHONE_NUMBER_ID

    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _build_assistant(
        self,
        campaign_script: str,
        lead_first_name: str = "",
        voice_id: str = None,
        voice_provider: str = "11labs",
        voice_settings: dict = None,
    ) -> dict:
        """Build a Vapi assistant config for a campaign call."""
        name = lead_first_name or "there"
        system_prompt = (
            "You are a professional, friendly sales agent on an outbound phone call. "
            "You speak naturally — use contractions, occasional filler words, and vary your pacing. "
            "Keep responses concise (1-3 sentences) since this is a live phone call. "
            "Be warm, empathetic, and never pushy. If the prospect wants to be removed from the list, "
            "acknowledge politely and end the call.\n\n"
            f"Campaign Script / Talking Points:\n{campaign_script}"
        )

        # Voice config — defaults to ElevenLabs Rachel (warm, natural female voice)
        voice_cfg: dict = {
            "provider": voice_provider,
            "voiceId": voice_id or "21m00Tcm4TlvDq8ikWAM",  # Rachel
        }
        if voice_provider == "11labs":
            voice_cfg.update({
                "stability": 0.30,
                "similarityBoost": 0.85,
                "style": 0.45,
                "useSpeakerBoost": True,
                **(voice_settings or {}),
            })
        elif voice_provider == "openai":
            # nova/shimmer are the most natural OpenAI voices
            voice_cfg["voiceId"] = voice_id or "nova"

        first_message = (
            f"Hey {name}! Hope I'm catching you at a good time. "
            "I'm calling from VoiceIQ — do you have a quick minute?"
        )

        return {
            "model": {
                "provider": "openai",
                "model": settings.OPENAI_MODEL or "gpt-4o-mini",
                "messages": [{"role": "system", "content": system_prompt}],
                "maxTokens": 200,
                "temperature": 0.7,
            },
            "voice": voice_cfg,
            "firstMessage": first_message,
            "endCallMessage": "Thanks so much for your time. Have a great day!",
            "endCallPhrases": [
                "goodbye",
                "bye",
                "take care",
                "remove me",
                "don't call again",
                "not interested",
            ],
            "transcriber": {
                "provider": "deepgram",
                "model": "nova-2",
                "language": "en-US",
            },
            "recordingEnabled": True,
            "silenceTimeoutSeconds": 30,
            "maxDurationSeconds": 600,
        }

    async def make_call(
        self,
        to: str,
        campaign_script: str,
        lead_first_name: str = "",
        voice_id: str = None,
        voice_provider: str = "11labs",
        voice_settings: dict = None,
        metadata: dict = None,
    ) -> dict:
        """Initiate an outbound call via Vapi. Returns the Vapi call object."""
        assistant = self._build_assistant(
            campaign_script=campaign_script,
            lead_first_name=lead_first_name,
            voice_id=voice_id,
            voice_provider=voice_provider,
            voice_settings=voice_settings,
        )

        payload = {
            "phoneNumberId": self.phone_number_id,
            "customer": {"number": to},
            "assistant": assistant,
        }
        if metadata:
            payload["metadata"] = metadata

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{VAPI_BASE_URL}/call",
                json=payload,
                headers=self._headers(),
                timeout=30.0,
            )
            response.raise_for_status()
            return response.json()

    async def stop_call(self, vapi_call_id: str) -> None:
        """End an active Vapi call."""
        async with httpx.AsyncClient() as client:
            response = await client.delete(
                f"{VAPI_BASE_URL}/call/{vapi_call_id}",
                headers=self._headers(),
                timeout=15.0,
            )
            # 404 means the call already ended — that's fine
            if response.status_code not in (200, 204, 404):
                response.raise_for_status()

    async def get_call(self, vapi_call_id: str) -> dict:
        """Fetch a Vapi call record."""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{VAPI_BASE_URL}/call/{vapi_call_id}",
                headers=self._headers(),
                timeout=15.0,
            )
            response.raise_for_status()
            return response.json()
