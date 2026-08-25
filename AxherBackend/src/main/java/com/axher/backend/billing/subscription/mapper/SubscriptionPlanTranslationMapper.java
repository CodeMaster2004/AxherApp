package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanTranslationDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlanTranslation;

@Component
public class SubscriptionPlanTranslationMapper {

    public SubscriptionPlanTranslationDto toDto(
            SubscriptionPlanTranslation translation
    ) {

        SubscriptionPlanTranslationDto dto =
                new SubscriptionPlanTranslationDto();

        dto.setSubscriptionPlanId(
                translation.getSubscriptionPlan()
                        .getSubscriptionPlanId()
        );

        dto.setLanguageId(
                translation.getLanguage()
                        .getLanguageId()
        );

        dto.setLanguageCode(
                translation.getLanguage()
                        .getCode()
        );

        dto.setLanguageName(
                translation.getLanguage()
                        .getName()
        );

        dto.setName(
                translation.getName()
        );

        dto.setDescription(
                translation.getDescription()
        );

        return dto;
    }
}
