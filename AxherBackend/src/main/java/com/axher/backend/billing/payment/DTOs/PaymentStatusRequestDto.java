package com.axher.backend.billing.payment.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentStatusRequestDto {

    private String code;
    private String name;
    private String description;
    
}
