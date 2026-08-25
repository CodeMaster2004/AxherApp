package com.axher.backend.billing.payment.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.payment.DTOs.PaymentStatusResponseDto;
import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.services.PaymentStatusLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PaymentStatusMapper {

    private final PaymentStatusLocalizationService localizationService;

    public PaymentStatusResponseDto toDto(PaymentStatus status){

        PaymentStatusResponseDto dto = new PaymentStatusResponseDto();
        dto.setPaymentStatusId(status.getPaymentStatusId());
        dto.setCode(status.getCode());
        var localizedStatus = localizationService.resolve(status);
        dto.setName(localizedStatus.name());
        dto.setDescription(localizedStatus.description());
        return dto;
    }
    
}
