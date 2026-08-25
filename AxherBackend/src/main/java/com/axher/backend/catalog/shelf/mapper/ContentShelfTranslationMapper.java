package com.axher.backend.catalog.shelf.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfTranslationDto;
import com.axher.backend.catalog.shelf.entities.ContentShelfTranslation;

@Component
public class ContentShelfTranslationMapper {

    public ContentShelfTranslationDto toDto(
            ContentShelfTranslation translation
    ) {

        ContentShelfTranslationDto dto =
                new ContentShelfTranslationDto();

        dto.setContentShelfId(
                translation.getContentShelf()
                        .getContentShelfId()
        );

        dto.setLanguageId(
                translation.getLanguage()
                        .getLanguageId()
        );

        dto.setLanguageCode(
                translation.getLanguage()
                        .getCode()
        );

        dto.setLanguageName(
                translation.getLanguage()
                        .getName()
        );

        dto.setName(
                translation.getName()
        );

        return dto;
    }
}