package com.axher.backend.billing.subscription.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionStatusTranslationRequestDto {

    private Integer languageId;
    private String name;
    private String description;
}