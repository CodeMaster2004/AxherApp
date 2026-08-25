package com.axher.backend.billing.subscription.service;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanLocalizationService {

    private final SubscriptionPlanTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;


    public LocalizedSubscriptionPlan resolve(
            SubscriptionPlans plan
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();


        if (languageCode == null || languageCode.isBlank()) {

            return resolveFallback(plan);
        }


        return translationService
                .findByPlanAndLanguage(
                        plan.getSubscriptionPlanId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedSubscriptionPlan(
                                translation.getName(),
                                translation.getDescription()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(plan)
                );
    }


    private LocalizedSubscriptionPlan resolveFallback(
            SubscriptionPlans plan
    ) {

        return translationService
                .findFirstAvailable(
                        plan.getSubscriptionPlanId()
                )
                .map(translation ->
                        new LocalizedSubscriptionPlan(
                                translation.getName(),
                                translation.getDescription()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El plan " +
                                plan.getSubscriptionPlanId() +
                                " no tiene traducciones"
                        )
                );
    }


    public record LocalizedSubscriptionPlan(
            String name,
            String description
    ) {}
    
}
