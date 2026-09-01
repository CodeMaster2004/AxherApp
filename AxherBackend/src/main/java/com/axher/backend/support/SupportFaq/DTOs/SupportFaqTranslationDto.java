package com.axher.backend.support.SupportFaq.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportFaqTranslationDto {

    private Integer supportFaqId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String question;
    private String answer;
    
}
