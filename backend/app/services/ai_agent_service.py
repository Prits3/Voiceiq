from typing import List, Optional

import openai

from app.core.config import settings

SYSTEM_PROMPT_TEMPLATE = """You are a professional sales agent conducting a phone call on behalf of a company.
Your goal is to have a natural, helpful conversation with the prospect.

Campaign Script / Talking Points:
{script}

Guidelines:
- Be professional, polite, and empathetic.
- Listen carefully to the prospect's responses and adapt accordingly.
- Do not be overly pushy or aggressive.
- Keep your responses concise (1-3 sentences) since this is a phone conversation.
- If the prospect asks to be removed from the call list, acknowledge politely and end the call.
- If the prospect is interested, try to schedule a follow-up or collect their information.
"""


class AIAgentService:
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = getattr(settings, "OPENAI_MODEL", "gpt-4o-mini")

    async def generate_response(
        self,
        user_input: str,
        campaign_script: str,
        conversation_history: Optional[List[dict]] = None,
    ) -> str:
        """Generate an AI agent response for the given user input during a call."""
        system_prompt = SYSTEM_PROMPT_TEMPLATE.format(script=campaign_script)
        messages = [{"role": "system", "content": system_prompt}]

        if conversation_history:
            messages.extend(conversation_history)

        messages.append({"role": "user", "content": user_input})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=200,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

    async def generate_opening(self, campaign_script: str, lead_first_name: str = "") -> str:
        """Generate a personalized opening statement for the call."""
        prompt = (
            f"Generate a brief, natural opening statement for a sales call."
            f" The prospect's name is {lead_first_name or 'the prospect'}."
            f" Campaign script: {campaign_script}"
            f" Keep it under 3 sentences and conversational."
        )
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()

    async def analyze_call_transcript(self, transcript: str) -> dict:
        """Analyze a completed call transcript and return structured insights."""
        prompt = (
            "Analyze the following call transcript and return a JSON object with keys:\n"
            "- sentiment: (positive/neutral/negative)\n"
            "- interested: (true/false)\n"
            "- objections: list of objections raised\n"
            "- next_steps: suggested follow-up actions\n"
            "- summary: one-sentence summary\n\n"
            f"Transcript:\n{transcript}"
        )
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        import json
        try:
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            return {"summary": response.choices[0].message.content}
