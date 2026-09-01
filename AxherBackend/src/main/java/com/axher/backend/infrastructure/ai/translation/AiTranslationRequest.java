package com.axher.backend.infrastructure.ai.translation;

import java.util.Map;

public record AiTranslationRequest(
    String sourceLanguage,
    String targetLanguage,
    Map<String, String> fields
) { 
}
