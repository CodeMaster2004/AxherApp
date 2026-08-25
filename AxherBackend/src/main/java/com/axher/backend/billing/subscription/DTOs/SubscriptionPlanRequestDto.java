package com.axher.backend.billing.subscription.DTOs;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionPlanRequestDto {

    
    private String name;
    private BigDecimal price;
    private String description;
    private Integer durationDays;
    private Integer languageId;

    
}
