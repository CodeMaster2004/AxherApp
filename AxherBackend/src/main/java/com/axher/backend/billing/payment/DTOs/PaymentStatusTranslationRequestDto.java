package com.axher.backend.billing.payment.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentStatusTranslationRequestDto {

    private Integer languageId;
    private String name;
    private String description;
}
