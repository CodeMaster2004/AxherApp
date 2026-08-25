package com.axher.backend.support.tickets.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportTicketStatusTranslationDto {

    private Integer supportTicketStatusId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
    private String description;
}