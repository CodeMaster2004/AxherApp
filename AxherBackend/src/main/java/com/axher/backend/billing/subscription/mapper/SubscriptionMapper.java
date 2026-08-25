package com.axher.backend.billing.subscription.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.billing.subscription.DTOs.SubscriptionResponseDto;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.service.SubscriptionPlanLocalizationService;
import com.axher.backend.billing.subscription.service.SubscriptionStatusLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SubscriptionMapper {

    private final SubscriptionPlanLocalizationService subscriptionPlanLocalizationService;
    private final SubscriptionStatusLocalizationService subscriptionStatusLocalizationService;

    public SubscriptionResponseDto toDto(Subscriptions subscription) {

        SubscriptionResponseDto dto = new SubscriptionResponseDto();
        dto.setSubscriptionId(subscription.getSubscriptionId());
        dto.setSubscriptionPlanId(
            subscription.getSubscriptionPlan().getSubscriptionPlanId()
        );
        var localizedPlan =
                subscriptionPlanLocalizationService.resolve(
                        subscription.getSubscriptionPlan()
                );
        dto.setSubscriptionPlanName(
            localizedPlan.name()
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
            var localizedStatus =
                    subscriptionStatusLocalizationService.resolve(
                            subscription.getSubscriptionStatus()
                    );
            dto.setSubscriptionStatus(
                localizedStatus.name()
            );
        }

        return dto;
    }
    
}
