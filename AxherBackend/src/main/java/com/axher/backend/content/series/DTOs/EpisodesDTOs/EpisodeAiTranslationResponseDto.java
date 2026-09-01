package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EpisodeAiTranslationResponseDto {

    private Integer sourceLanguageId;
    private Integer targetLanguageId;
    private String sourceTitle;
    private String sourceDescription;
    private String translatedTitle;
    private String translatedDescription;
}
