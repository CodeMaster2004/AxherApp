package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;

@Component
public class SubscriptionStatusMapper {

    public SubscriptionStatusResponseDto toDto(SubscriptionStatus status) {
        SubscriptionStatusResponseDto dto = new SubscriptionStatusResponseDto();
        dto.setSubscriptionStatusId(status.getSubscriptionStatusId());
        dto.setCode(status.getCode());
        dto.setName(status.getName());
        dto.setDescription(status.getDescription());
        return dto;
    }
    
}
