package com.axher.backend.support.tickets.DTOs;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketResponseDto {

    private Integer supportTicketId;

    private String subject;

    private Integer supportCategoryId;
    private String supportCategoryCode;
    private String supportCategoryName;

    private Integer userId;

    private Integer supportTicketStatusId;
    private String supportTicketStatusCode;
    private String supportTicketStatusName;

    private Integer subscriptionId;

    private Integer subscriptionPaymentId;

    private Instant createdAt;
    private Instant updatedAt;
    private Instant resolvedAt;
    private Instant closedAt;
    
}
