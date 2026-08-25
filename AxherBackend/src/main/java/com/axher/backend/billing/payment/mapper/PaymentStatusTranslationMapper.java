package com.axher.backend.billing.payment.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.payment.DTOs.PaymentStatusTranslationDto;
import com.axher.backend.billing.payment.entities.PaymentStatusTranslation;

@Component
public class PaymentStatusTranslationMapper {

    public PaymentStatusTranslationDto toDto(
            PaymentStatusTranslation translation
    ) {

        PaymentStatusTranslationDto dto =
                new PaymentStatusTranslationDto();

        dto.setPaymentStatusId(
                translation.getPaymentStatus()
                        .getPaymentStatusId()
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
