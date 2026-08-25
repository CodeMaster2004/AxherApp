package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportCategoryTranslationDto;
import com.axher.backend.support.tickets.entities.SupportCategoryTranslation;

@Component
public class SupportCategoryTranslationMapper {

    public SupportCategoryTranslationDto toDto(
            SupportCategoryTranslation translation
    ) {

        SupportCategoryTranslationDto dto =
                new SupportCategoryTranslationDto();

        dto.setSupportCategoryId(
                translation.getSupportCategory()
                        .getSupportCategoryId()
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
