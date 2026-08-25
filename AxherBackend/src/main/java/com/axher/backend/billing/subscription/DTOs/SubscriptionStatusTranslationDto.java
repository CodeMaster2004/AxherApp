package com.axher.backend.billing.subscription.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionStatusTranslationDto {

    private Integer subscriptionStatusId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
    private String description;
}
