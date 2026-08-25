package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.service.SubscriptionPlanLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionPlanMapper {

    private final SubscriptionPlanLocalizationService subscriptionPlanLocalizationService;

    public SubscriptionPlanResponseDto toDto(SubscriptionPlans plan) {

        SubscriptionPlanResponseDto dto = new SubscriptionPlanResponseDto();
        dto.setSubscriptionPlanId(plan.getSubscriptionPlanId());
        var localized =
                subscriptionPlanLocalizationService.resolve(plan);
        dto.setName(localized.name());
        dto.setPrice(plan.getPrice());
        dto.setDescription(localized.description());
        dto.setDurationDays(plan.getDurationDays());
        dto.setCreatedAt(plan.getCreatedAt());
        return dto;
    }
    
}
