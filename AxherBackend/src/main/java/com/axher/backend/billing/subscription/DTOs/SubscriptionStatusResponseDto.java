package com.axher.backend.billing.subscription.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubscriptionStatusResponseDto {

    private Integer subscriptionStatusId;
    private String code;
    private String name;
    private String description;
    
}
