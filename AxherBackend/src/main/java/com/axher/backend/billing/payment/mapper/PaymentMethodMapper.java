package com.axher.backend.billing.payment.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.payment.DTOs.PaymentMethodResponseDto;
import com.axher.backend.billing.payment.entities.PaymentMethods;

@Component
public class PaymentMethodMapper {

    public PaymentMethodResponseDto toDto(PaymentMethods paymentMethod) {
        PaymentMethodResponseDto responseDto = new PaymentMethodResponseDto();

        responseDto.setPaymentMethodId(paymentMethod.getPaymentMethodId());
        responseDto.setProvider(paymentMethod.getProvider());
        responseDto.setCardBrand(paymentMethod.getCardBrand());
        responseDto.setCardLastFour(paymentMethod.getCardLastFour());
        responseDto.setExpirationMonth(paymentMethod.getExpirationMonth());
        responseDto.setExpirationYear(paymentMethod.getExpirationYear());
        responseDto.setIsDefault(paymentMethod.getIsDefault());
        responseDto.setActive(paymentMethod.getActive());
        responseDto.setCreatedAt(paymentMethod.getCreatedAt());
        return responseDto;
    }
    
}
