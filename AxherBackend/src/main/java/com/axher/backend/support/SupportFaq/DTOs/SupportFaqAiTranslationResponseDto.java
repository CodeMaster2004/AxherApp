package com.axher.backend.support.SupportFaq.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class SupportFaqAiTranslationResponseDto {

    private Integer sourceLanguageId;
    private Integer targetLanguageId;
    private String sourceQuestion;
    private String sourceAnswer;
    private String translatedQuestion;
    private String translatedAnswer;
}
