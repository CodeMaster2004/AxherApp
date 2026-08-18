from pydantic import BaseModel, Field

from axher_ai.support.classifier import SupportCategory


class SupportRequest(BaseModel):
    message: str = Field(
        min_length=1,
        max_length=2000,
    )

    user_id: int | None = None
    user_name: str | None = None
    user_email: str | None = None

    subscription_active: bool | None = None
    subscription_plan: str | None = None

    content_title: str | None = None
    content_available: bool | None = None


class SupportResponse(BaseModel):
    response: str
    category: SupportCategory
    resolved: bool
    escalate: bool