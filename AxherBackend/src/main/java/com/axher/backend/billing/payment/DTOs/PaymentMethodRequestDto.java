package com.axher.backend.billing.payment.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentMethodRequestDto {

    private String provider;

    private String providerPaymentMethodId;
    
}
