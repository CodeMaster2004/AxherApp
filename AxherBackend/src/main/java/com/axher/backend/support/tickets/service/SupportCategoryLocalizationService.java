package com.axher.backend.support.tickets.service;

import org.springframework.stereotype.Service;

import com.axher.backend.language.service.CurrentLanguageService;
import com.axher.backend.support.tickets.entities.SupportCategory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportCategoryLocalizationService {

    private final SupportCategoryTranslationService translationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedSupportCategory resolve(
            SupportCategory category
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(category);
        }

        return translationService
                .findByCategoryAndLanguage(
                        category.getSupportCategoryId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedSupportCategory(
                                category.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(category)
                );
    }

    private LocalizedSupportCategory resolveFallback(
            SupportCategory category
    ) {

        return translationService
                .findFirstAvailable(
                        category.getSupportCategoryId()
                )
                .map(translation ->
                        new LocalizedSupportCategory(
                                category.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "La categoría de soporte "
                                + category.getSupportCategoryId()
                                + " no tiene traducciones"
                        )
                );
    }

    public record LocalizedSupportCategory(
            String code,
            String name,
            String description,
            Integer languageId
    ) {}
}
