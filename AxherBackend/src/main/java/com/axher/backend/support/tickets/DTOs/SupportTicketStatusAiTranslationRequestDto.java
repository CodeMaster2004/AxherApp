package com.axher.backend.support.tickets.DTOs;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SupportTicketStatusAiTranslationRequestDto {
    private Integer targetLanguageId;
}
