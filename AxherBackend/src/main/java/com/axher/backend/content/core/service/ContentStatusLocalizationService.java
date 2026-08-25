package com.axher.backend.content.core.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentStatusLocalizationService {

    private final ContentStatusTranslationService translationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedStatus resolve(ContentStatus status) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(status);
        }

        return translationService
                .findByStatusAndLanguage(
                        status.getContentStatusId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(status)
                );
    }

    private LocalizedStatus resolveFallback(ContentStatus status) {

        return translationService
                .findFirstAvailable(
                        status.getContentStatusId()
                )
                .map(translation ->
                        new LocalizedStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El estado " +
                                status.getContentStatusId() +
                                " no tiene traducciones"
                        )
                );
    }

    public record LocalizedStatus(
            String code,
            String name,
            String description,
            Integer languageId
    ) {}
}
