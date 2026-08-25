package com.axher.backend.catalog.shelf.service;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentShelfLocalizationService {

    private final ContentShelfTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;

    public LocalizedShelf resolve(ContentShelf shelf) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(shelf);
        }

        return translationService
                .findByShelfAndLanguage(
                        shelf.getContentShelfId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedShelf(
                                translation.getName(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(shelf)
                );
    }

    private LocalizedShelf resolveFallback(
            ContentShelf shelf
    ) {

        return translationService
                .findFirstAvailable(
                        shelf.getContentShelfId()
                )
                .map(translation ->
                        new LocalizedShelf(
                                translation.getName(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El shelf " +
                                shelf.getContentShelfId() +
                                " no tiene traducciones"
                        )
                );
    }

    public record LocalizedShelf(
            String name,
            Integer languageId
    ) {}
}