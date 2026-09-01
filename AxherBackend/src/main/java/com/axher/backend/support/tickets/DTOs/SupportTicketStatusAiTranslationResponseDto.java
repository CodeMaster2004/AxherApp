package com.axher.backend.support.tickets.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SupportTicketStatusAiTranslationResponseDto {

    private Integer sourceLanguageId;
    private Integer targetLanguageId;
    private String sourceName;
    private String sourceDescription;
    private String translatedName;
    private String translatedDescription;

}
