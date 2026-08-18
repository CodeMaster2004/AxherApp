package com.axher.backend.billing.payment.DTOs;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaymentMethodResponseDto {

    private Integer paymentMethodId;
    private String provider;
    private String cardBrand;
    private String cardLastFour;
    private Short expirationMonth;
    private Short expirationYear;
    private Boolean isDefault;
    private Boolean active;
    private LocalDateTime createdAt;
    
}
