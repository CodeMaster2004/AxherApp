package com.axher.backend.infrastructure.ai.translation;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiTranslationService {

    private final ChatClient chatClient;

    public AiTranslationResult translate(
            AiTranslationRequest request
    ){
        if (request == null) {
            throw new IllegalArgumentException(
                    "Translation request cannot be null"
            );
        }

        if (request.fields() == null || request.fields().isEmpty()) {
            throw new IllegalArgumentException(
                    "Translation fields cannot be empty"
            );
        }
        

        return chatClient
                .prompt()
                .system("""
                        You are a professional translation engine.

                        Your task is to translate the provided content
                        from the source language to the target language.

                        Rules:
                        - Preserve the original meaning and tone.
                        - Return only the translated content.
                        - Do not add explanations or comments.
                        - Preserve names and proper nouns.
                        - Preserve numbers.
                        - Preserve URLs.
                        - Do not translate technical identifiers.
                        - Preserve intentional formatting.
                        """)
                    .user("""
                        Source language: %s
                        Target language: %s

                        Content:
                        %s
                    """.formatted(
                        request.sourceLanguage(),
                        request.targetLanguage(),
                        request.fields()
                    ))
                    .call()
                    .entity(AiTranslationResult.class);

                    
    }
    
}
