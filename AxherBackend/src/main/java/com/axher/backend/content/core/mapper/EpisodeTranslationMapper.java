package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeTranslationDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;

@Component
public class EpisodeTranslationMapper {

    public EpisodeTranslationDto toDto(EpisodeTranslation translation) {

        EpisodeTranslationDto dto = new EpisodeTranslationDto();

        dto.setEpisodeId(
            translation.getEpisode().getEpisodeId()
        );

        dto.setLanguageId(
            translation.getLanguage().getLanguageId()
        );

        dto.setLanguageCode(
            translation.getLanguage().getCode()
        );

        dto.setLanguageName(
            translation.getLanguage().getName()
        );

        dto.setTitle(
            translation.getTitle()
        );

        dto.setDescription(
            translation.getDescription()
        );

        return dto;
    }
    
}
