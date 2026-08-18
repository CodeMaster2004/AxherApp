package com.axher.backend.billing.payment.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.payment.DTOs.PaymentStatusResponseDto;
import com.axher.backend.billing.payment.entities.PaymentStatus;

@Component
public class PaymentStatusMapper {

    public PaymentStatusResponseDto toDto(PaymentStatus status){

        PaymentStatusResponseDto dto = new PaymentStatusResponseDto();
        dto.setPaymentStatusId(status.getPaymentStatusId());
        dto.setCode(status.getCode());
        dto.setName(status.getName());
        dto.setDescription(status.getDescription());
        return dto;
    }
    
}
