from contextlib import asynccontextmanager

from fastapi import FastAPI

from axher_ai.api.v1.health import router as health_router
from axher_ai.api.v1.support import router as support_router
from axher_ai.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("AxherAI iniciando...")

    yield

    print("AxherAI detenido.")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.include_router(health_router)
app.include_router(support_router)