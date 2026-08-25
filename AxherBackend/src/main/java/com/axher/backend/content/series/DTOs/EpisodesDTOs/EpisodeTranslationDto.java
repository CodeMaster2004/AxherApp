package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EpisodeTranslationDto {
    private Integer episodeId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String title;
    private String description;
}
