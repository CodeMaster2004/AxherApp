package com.axher.backend.billing.subscription.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionCheckoutRequestDto {

    private Integer subscriptionId;
    private Integer paymentMethodId;
    
}
