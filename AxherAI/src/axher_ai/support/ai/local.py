from axher_ai.support.ai.provider import AIProvider


class LocalAIProvider(AIProvider):

    def generate_response(self, prompt: str) -> str:
        return f"Respuesta generada localmente para: {prompt}"