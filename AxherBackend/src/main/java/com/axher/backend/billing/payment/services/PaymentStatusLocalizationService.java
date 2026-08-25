package com.axher.backend.billing.payment.services;
import org.springframework.stereotype.Service;

import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class PaymentStatusLocalizationService {

    private final PaymentStatusTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;

    public LocalizedPaymentStatus resolve(
            PaymentStatus status
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(status);
        }

        return translationService
                .findByStatusAndLanguage(
                        status.getPaymentStatusId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedPaymentStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(status)
                );
    }

    private LocalizedPaymentStatus resolveFallback(
            PaymentStatus status
    ) {

        return translationService
                .findFirstAvailable(
                        status.getPaymentStatusId()
                )
                .map(translation ->
                        new LocalizedPaymentStatus(
                                status.getCode(),
                                translation.getName(),
                                translation.getDescription()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El estado de pago "
                                + status.getPaymentStatusId()
                                + " no tiene traducciones"
                        )
                );
    }

    public record LocalizedPaymentStatus(
            String code,
            String name,
            String description
    ) {}
}