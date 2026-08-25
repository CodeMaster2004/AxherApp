package com.axher.backend.billing.payment.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentStatusTranslationDto {

    private Integer paymentStatusId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
    private String description;
}
