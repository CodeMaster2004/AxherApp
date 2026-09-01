package com.axher.backend.support.SupportFaq.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportFaqTranslationRequestDto {
    
    private Integer languageId;
    private String question;
    private String answer;
}
