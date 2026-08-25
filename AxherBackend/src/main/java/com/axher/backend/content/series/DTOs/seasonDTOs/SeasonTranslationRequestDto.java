package com.axher.backend.content.series.DTOs.seasonDTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeasonTranslationRequestDto {
    private Integer languageId;
    private String title;
    private String description;
}
