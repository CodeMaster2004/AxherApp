package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonTranslationDto;
import com.axher.backend.content.series.entities.SeasonTranslation;

@Component
public class SeasonTranslationMapper {

    public SeasonTranslationDto toDto(SeasonTranslation translation) {

        SeasonTranslationDto dto = new SeasonTranslationDto();

        dto.setSeasonId(
            translation.getSeason().getSeasonId()
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
