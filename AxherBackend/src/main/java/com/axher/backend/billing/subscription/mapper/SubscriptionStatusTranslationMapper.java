package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusTranslationDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatusTranslation;

@Component
public class SubscriptionStatusTranslationMapper {

    public SubscriptionStatusTranslationDto toDto(
            SubscriptionStatusTranslation translation
    ) {

        SubscriptionStatusTranslationDto dto =
                new SubscriptionStatusTranslationDto();

        dto.setSubscriptionStatusId(
                translation.getSubscriptionStatus()
                        .getSubscriptionStatusId()
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