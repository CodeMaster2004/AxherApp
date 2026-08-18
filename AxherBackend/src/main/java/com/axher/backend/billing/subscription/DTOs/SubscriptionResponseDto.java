package com.axher.backend.billing.subscription.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionResponseDto {

    private Integer subscriptionId;

    private Integer subscriptionPlanId;
    private String subscriptionPlanName;
    private BigDecimal subscriptionPlanPrice;

    private LocalDate startDate;
    private LocalDate endDate;

    private Integer discountId;

    private Integer subscriptionStatusId;
    private String subscriptionStatus;
    
}
