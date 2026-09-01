package com.axher.backend.support.SupportFaq.service;

import org.springframework.stereotype.Service;

import com.axher.backend.language.service.CurrentLanguageService;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportFaqLocalizationService {

    private final SupportFaqTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;


    public LocalizedSupportFaq resolve(
            SupportFaq faq
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();


        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(faq);
        }


        return translationService
                .findByFaqAndLanguage(
                        faq.getSupportFaqId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedSupportFaq(
                                translation.getQuestion(),
                                translation.getAnswer(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(faq)
                );
    }


    private LocalizedSupportFaq resolveFallback(
            SupportFaq faq
    ) {

        return translationService
                .findFirstAvailable(
                        faq.getSupportFaqId()
                )
                .map(translation ->
                        new LocalizedSupportFaq(
                                translation.getQuestion(),
                                translation.getAnswer(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El FAQ de soporte "
                                + faq.getSupportFaqId()
                                + " no tiene traducciones"
                        )
                );
    }


    public record LocalizedSupportFaq(
            String question,
            String answer,
            Integer languageId
    ) {}
}