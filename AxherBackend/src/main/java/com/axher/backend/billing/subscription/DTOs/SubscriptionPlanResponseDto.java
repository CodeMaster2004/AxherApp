package com.axher.backend.billing.subscription.DTOs;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionPlanResponseDto {

    private Integer subscriptionPlanId;
    private String name;
    private BigDecimal price;
    private String description;
    private Integer durationDays;
    private Instant createdAt;
    
}
