package com.axher.backend.content.core.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentCategoryLocalizationService {

    private final ContentCategoryTranslationService translationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedCategory resolve(ContentCategories category) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(category);
        }

        return translationService
                .findByCategoryAndLanguage(
                        category.getContentCategoryId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedCategory(
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(category)
                );
    }

    private LocalizedCategory resolveFallback(ContentCategories category) {

        return translationService
                .findFirstAvailable(category.getContentCategoryId())
                .map(translation ->
                        new LocalizedCategory(
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "La categoría " +
                                category.getContentCategoryId() +
                                " no tiene traducciones"
                        )
                );
    }

    public record LocalizedCategory(
            String name,
            String description,
            Integer languageId
    ) {}
}
