package com.axher.backend.infrastructure.ai.translation;

public interface TranslationProvider {
    
    String translate(
        String text,
        String sourceLanguage,
        String targetLanguage
    );
    
}
