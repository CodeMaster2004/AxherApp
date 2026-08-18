package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;

@Component
public class SubscriptionPlanMapper {

    public SubscriptionPlanResponseDto toDto(SubscriptionPlans plan) {

        SubscriptionPlanResponseDto dto = new SubscriptionPlanResponseDto();
        dto.setSubscriptionPlanId(plan.getSubscriptionPlanId());
        dto.setName(plan.getName());
        dto.setPrice(plan.getPrice());
        dto.setDescription(plan.getDescription());
        dto.setDurationDays(plan.getDurationDays());
        dto.setCreatedAt(plan.getCreatedAt());
        return dto;
    }
    
}
