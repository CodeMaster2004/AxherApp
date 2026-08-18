package com.axher.backend.billing.subscription.DTOs;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionPaymentResponseDto {

    private Integer subscriptionPaymentId;
    private Integer subscriptionId;
    private BigDecimal amount;
    private LocalDateTime paymentDate;
    private Integer paymentMethodId;
    private Integer paymentStatusId;
    
}
