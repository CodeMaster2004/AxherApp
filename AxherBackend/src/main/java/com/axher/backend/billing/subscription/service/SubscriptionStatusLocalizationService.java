package com.axher.backend.billing.subscription.service;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionStatusLocalizationService {

    private final SubscriptionStatusTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;


    public LocalizedSubscriptionStatus resolve(
            SubscriptionStatus status
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();


        if (languageCode == null || languageCode.isBlank()) {

            return resolveFallback(status);
        }


        return translationService

                .findByStatusAndLanguage(
                        status.getSubscriptionStatusId(),
                        languageCode
                )

                .map(translation ->
                        new LocalizedSubscriptionStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription()
                        )
                )

                .orElseGet(() ->
                        resolveFallback(status)
                );
    }


    private LocalizedSubscriptionStatus resolveFallback(
            SubscriptionStatus status
    ) {

        return translationService

                .findFirstAvailable(
                        status.getSubscriptionStatusId()
                )

                .map(translation ->
                        new LocalizedSubscriptionStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription()
                        )
                )

                .orElseThrow(() ->
                        new IllegalStateException(
                                "El estado de suscripción "
                                + status.getSubscriptionStatusId()
                                + " no tiene traducciones"
                        )
                );
    }


    public record LocalizedSubscriptionStatus(
            String code,
            String name,
            String description
    ) {}
}