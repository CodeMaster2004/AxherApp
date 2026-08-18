package com.axher.backend.support.tickets.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketRequestDto {

    private Integer supportCategoryId;
    private String subject;
    private String description;
    private Integer subscriptionId;
    private Integer subscriptionPaymentId;
    
}
