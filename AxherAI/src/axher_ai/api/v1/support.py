from fastapi import APIRouter

from axher_ai.support.schemas import (
    SupportRequest,
    SupportResponse,
)
from axher_ai.support.service import process_support


router = APIRouter(
    prefix="/support",
    tags=["Support"],
)


@router.post(
    "/",
    response_model=SupportResponse,
)
def support(request: SupportRequest) -> SupportResponse:
    return process_support(request)