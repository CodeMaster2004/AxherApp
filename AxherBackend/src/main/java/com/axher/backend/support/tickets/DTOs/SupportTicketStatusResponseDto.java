package com.axher.backend.support.tickets.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SupportTicketStatusResponseDto {

    private Integer supportTicketStatusId;
    private String code;
    private String name;
    private String description;
    private Integer languageId;
    
}
