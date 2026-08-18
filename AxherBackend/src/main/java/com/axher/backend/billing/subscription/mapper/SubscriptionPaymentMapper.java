package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPaymentResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPayments;

@Component
public class SubscriptionPaymentMapper {

    public SubscriptionPaymentResponseDto toDto(SubscriptionPayments payment) {

        SubscriptionPaymentResponseDto dto = new SubscriptionPaymentResponseDto();
        dto.setSubscriptionPaymentId(payment.getSubscriptionPaymentId());
        dto.setSubscriptionId(payment.getSubscription().getSubscriptionId());
        dto.setAmount(payment.getAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethodId(
            payment.getPaymentMethod() != null
                ? payment.getPaymentMethod().getPaymentMethodId()
                : null
        );
        dto.setPaymentStatusId(
            payment.getPaymentStatus() != null
                ? payment.getPaymentStatus().getPaymentStatusId()
                : null
        );
        return dto;
    }
    
}
