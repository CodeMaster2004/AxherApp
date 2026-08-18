from dataclasses import dataclass


@dataclass
class SupportContext:
    user_id: int | None = None
    user_name: str | None = None
    user_email: str | None = None

    subscription_active: bool | None = None
    subscription_plan: str | None = None

    content_title: str | None = None
    content_available: bool | None = None

    message: str = ""