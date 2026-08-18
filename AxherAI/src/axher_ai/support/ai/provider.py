from abc import ABC, abstractmethod

from axher_ai.support.schemas import SupportResponse


class AIProvider(ABC):

    @abstractmethod
    def generate_response(
        self,
        prompt: str,
    ) -> SupportResponse:
        pass