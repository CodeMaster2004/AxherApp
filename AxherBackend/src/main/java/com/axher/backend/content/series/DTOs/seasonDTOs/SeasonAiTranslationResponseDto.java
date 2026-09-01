package com.axher.backend.content.series.DTOs.seasonDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SeasonAiTranslationResponseDto {

    private Integer sourceLanguageId;
    private Integer targetLanguageId;
    private String sourceTitle;
    private String sourceDescription;
    private String translatedTitle;
    private String translatedDescription;
}
