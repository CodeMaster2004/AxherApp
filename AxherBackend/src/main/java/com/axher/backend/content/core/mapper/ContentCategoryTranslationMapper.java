package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentCategoryTranslationDto;
import com.axher.backend.content.core.entities.ContentCategoryTranslation;

@Component
public class ContentCategoryTranslationMapper {

    public ContentCategoryTranslationDto toDto(
            ContentCategoryTranslation translation
    ) {

        ContentCategoryTranslationDto dto =
                new ContentCategoryTranslationDto();

        dto.setCategoryId(
                translation.getContentCategory()
                        .getContentCategoryId()
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
