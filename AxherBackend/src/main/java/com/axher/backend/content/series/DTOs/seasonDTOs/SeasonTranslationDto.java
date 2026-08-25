package com.axher.backend.content.series.DTOs.seasonDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SeasonTranslationDto {

    private Integer seasonId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String title;
    private String description;
    
}
