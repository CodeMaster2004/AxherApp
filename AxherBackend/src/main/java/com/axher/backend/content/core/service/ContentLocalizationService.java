package com.axher.backend.content.core.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;

import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentLocalizationService {

    private final ContentTranslationService contentTranslationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedContent resolve(Content content) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveOriginal(content);
        }

        String originalLanguageCode =
                content.getOriginalLanguage().getCode();

        if (originalLanguageCode.equalsIgnoreCase(languageCode)) {
            return resolveOriginal(content);
        }

        return contentTranslationService
                .findByContentAndLanguage(
                        content.getContentId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedContent(
                                translation.getTitle(),
                                translation.getDescription()
                        )
                )
                .orElseGet(() -> resolveOriginal(content));
    }

        private LocalizedContent resolveOriginal(Content content) {

                return contentTranslationService
                        .findByContentAndLanguage(
                                content.getContentId(),
                                content.getOriginalLanguage().getCode()
                        )
                        .map(translation ->
                                new LocalizedContent(
                                        translation.getTitle(),
                                        translation.getDescription()
                                )
                        )
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "El contenido " +
                                        content.getContentId() +
                                        " no tiene traducción para su idioma original"
                                )
                        );
        }

    public record LocalizedContent(
            String title,
            String description
    ) {}
}