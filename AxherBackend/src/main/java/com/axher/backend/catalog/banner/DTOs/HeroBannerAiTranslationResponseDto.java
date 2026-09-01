package com.axher.backend.catalog.banner.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class HeroBannerAiTranslationResponseDto {

    private Integer sourceLanguageId;
    private Integer targetLanguageId;
    private String sourceTitleOverride;
    private String sourceDescriptionOverride;
    private String translatedTitleOverride;
    private String translatedDescriptionOverride;
}