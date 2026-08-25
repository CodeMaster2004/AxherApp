package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.service.SubscriptionStatusLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionStatusMapper {

    private final SubscriptionStatusLocalizationService subscriptionStatusLocalizationService;

    public SubscriptionStatusResponseDto toDto(SubscriptionStatus status) {
        SubscriptionStatusResponseDto dto = new SubscriptionStatusResponseDto();
        dto.setSubscriptionStatusId(status.getSubscriptionStatusId());
        dto.setCode(status.getCode());
        var localizedStatus =
                subscriptionStatusLocalizationService.resolve(status);
        dto.setName(localizedStatus.name());
        dto.setDescription(localizedStatus.description());
        return dto;
    }
    
}
