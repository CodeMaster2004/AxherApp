package com.axher.backend.support.reports.service;

import org.springframework.stereotype.Service;

import com.axher.backend.language.service.CurrentLanguageService;
import com.axher.backend.support.reports.entities.ReportStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportStatusLocalizationService {

    private final ReportStatusTranslationService translationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedReportStatus resolve(ReportStatus status) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(status);
        }

        return translationService
                .findByStatusAndLanguage(
                        status.getReportStatusId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedReportStatus(
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

    private LocalizedReportStatus resolveFallback(
            ReportStatus status
    ) {
        return translationService
                .findFirstAvailable(
                        status.getReportStatusId()
                )
                .map(translation ->
                        new LocalizedReportStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El estado de reporte "
                                + status.getReportStatusId()
                                + " no tiene traducciones"
                        )
                );
    }

    public record LocalizedReportStatus(
            String code,
            String name,
            String description,
            Integer languageId
    ) {}
}
