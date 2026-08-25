package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentStatusTranslationDto;
import com.axher.backend.content.core.entities.ContentStatusTranslation;

@Component
public class ContentStatusTranslationMapper {

    public ContentStatusTranslationDto toDto(
            ContentStatusTranslation translation
    ) {

        ContentStatusTranslationDto dto =
                new ContentStatusTranslationDto();

        dto.setContentStatusId(
                translation.getContentStatus()
                        .getContentStatusId()
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

        dto.setDescription(
                translation.getDescription()
        );

        return dto;
    }
}
