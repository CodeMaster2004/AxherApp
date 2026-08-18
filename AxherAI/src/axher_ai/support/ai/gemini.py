import os

from google import genai

from axher_ai.support.ai.provider import AIProvider
from axher_ai.support.schemas import SupportResponse


class GeminiAIProvider(AIProvider):

    def __init__(self):
        api_key = os.environ["GEMINI_API_KEY"]
        self.client = genai.Client(api_key=api_key)

    def generate_response(self, prompt: str) -> SupportResponse:

        response = self.client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": SupportResponse,
            },
        )

        return SupportResponse.model_validate_json(
            response.text
        )