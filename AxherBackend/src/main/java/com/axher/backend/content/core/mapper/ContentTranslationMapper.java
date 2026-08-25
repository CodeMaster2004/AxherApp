package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentTranslationDto;
import com.axher.backend.content.core.entities.ContentTranslation;

@Component
public class ContentTranslationMapper {

    public ContentTranslationDto toDto(ContentTranslation translation){
        ContentTranslationDto dto = new ContentTranslationDto();
        dto.setContentId(translation.getContent().getContentId());
        dto.setLanguageId(translation.getLanguage().getLanguageId());
        dto.setLanguageCode(translation.getLanguage().getCode());
        dto.setLanguageName(translation.getLanguage().getName());
        dto.setTitle(translation.getTitle());
        dto.setDescription(translation.getDescription());
        return dto;
    }
    
}
