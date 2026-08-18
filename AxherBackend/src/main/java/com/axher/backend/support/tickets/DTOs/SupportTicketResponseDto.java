package com.axher.backend.support.tickets.DTOs;

import java.time.LocalDateTime;

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

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    
}
