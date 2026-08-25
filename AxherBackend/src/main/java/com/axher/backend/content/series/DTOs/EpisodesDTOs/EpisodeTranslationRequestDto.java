package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EpisodeTranslationRequestDto {
    private Integer languageId;
    private String title;
    private String description;
}
