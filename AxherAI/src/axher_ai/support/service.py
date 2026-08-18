from axher_ai.support.ai.gemini import GeminiAIProvider
from axher_ai.support.context import SupportContext
from axher_ai.support.prompt import build_support_prompt
from axher_ai.support.classifier import classify_message
from axher_ai.support.schemas import (
    SupportRequest,
    SupportResponse,
)


ai_provider = GeminiAIProvider()


def process_support(request: SupportRequest) -> SupportResponse:
    context = SupportContext(
        user_id=request.user_id,
        user_name=request.user_name,
        user_email=request.user_email,
        subscription_active=request.subscription_active,
        subscription_plan=request.subscription_plan,
        content_title=request.content_title,
        content_available=request.content_available,
        message=request.message,
    )

    category = classify_message(request.message)

    prompt = build_support_prompt(context)

    ai_response = ai_provider.generate_response(prompt)

    return SupportResponse(
        response=ai_response.response,
        category=category.value,
        resolved=False,
        escalate=ai_response.escalate,
    )