package com.axher.backend.billing.payment.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentStatusResponseDto {

    private Integer paymentStatusId;
    private String code;
    private String name;
    private String description;
    
}
