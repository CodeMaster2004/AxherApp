package com.axher.backend.support.tickets.service;

import org.springframework.stereotype.Service;

import com.axher.backend.language.service.CurrentLanguageService;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportTicketStatusLocalizationService {

    private final SupportTicketStatusTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;

    public LocalizedSupportTicketStatus resolve(
            SupportTicketStatus status
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(status);
        }

        return translationService
                .findByStatusAndLanguage(
                        status.getSupportTicketStatusId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedSupportTicketStatus(
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

    private LocalizedSupportTicketStatus resolveFallback(
            SupportTicketStatus status
    ) {

        return translationService
                .findFirstAvailable(
                        status.getSupportTicketStatusId()
                )
                .map(translation ->
                        new LocalizedSupportTicketStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El estado de ticket "
                                + status.getSupportTicketStatusId()
                                + " no tiene traducciones"
                        )
                );
    }

    public record LocalizedSupportTicketStatus(
            String code,
            String name,
            String description,
            Integer languageId
    ) {}
}
