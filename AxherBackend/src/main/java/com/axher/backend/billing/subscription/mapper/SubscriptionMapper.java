package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanResponseDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionResponseDto;
import com.axher.backend.billing.subscription.entities.Subscriptions;

@Component
public class SubscriptionMapper {

    public SubscriptionResponseDto toDto(Subscriptions subscription) {

        SubscriptionResponseDto dto = new SubscriptionResponseDto();
        dto.setSubscriptionId(subscription.getSubscriptionId());
        dto.setSubscriptionPlanId(
            subscription.getSubscriptionPlan().getSubscriptionPlanId()
        );
        dto.setSubscriptionPlanName(
            subscription.getSubscriptionPlan().getName()
        );
        dto.setSubscriptionPlanPrice(
            subscription.getSubscriptionPlan().getPrice()
        );
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        if (subscription.getDiscount() != null) {
            dto.setDiscountId(
                subscription.getDiscount().getDiscountId()
            );
        }
        if (subscription.getSubscriptionStatus() != null) {
            dto.setSubscriptionStatusId(
                subscription.getSubscriptionStatus().getSubscriptionStatusId()
            );
            dto.setSubscriptionStatus(
                subscription.getSubscriptionStatus().getName()
            );
        }

        return dto;
    }
    
}
