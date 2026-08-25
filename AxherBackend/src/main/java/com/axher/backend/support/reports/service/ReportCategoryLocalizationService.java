package com.axher.backend.support.reports.service;

import org.springframework.stereotype.Service;

import com.axher.backend.language.service.CurrentLanguageService;
import com.axher.backend.support.reports.entities.ReportCategory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportCategoryLocalizationService {

    private final ReportCategoryTranslationService translationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedReportCategory resolve(ReportCategory category) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(category);
        }

        return translationService
                .findByCategoryAndLanguage(
                        category.getReportCategoryId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedReportCategory(
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

    private LocalizedReportCategory resolveFallback(
            ReportCategory category
    ) {

        return translationService
                .findFirstAvailable(
                        category.getReportCategoryId()
                )
                .map(translation ->
                        new LocalizedReportCategory(
                                category.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "La categoría de reporte "
                                + category.getReportCategoryId()
                                + " no tiene traducciones"
                        )
                );
    }

    public record LocalizedReportCategory(
            String code,
            String name,
            String description,
            Integer languageId
    ) {}
}
