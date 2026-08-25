package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentStatusResponseDto;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.service.ContentStatusLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ContentStatusMapper {

    private final ContentStatusLocalizationService localizationService;
    
    public ContentStatusResponseDto toDto(ContentStatus status){

        if(status == null){
            return null;
        }

        ContentStatusResponseDto dto = new ContentStatusResponseDto();

        dto.setContentStatusId(status.getContentStatusId());
        dto.setCode(status.getCode());
        var localized = localizationService.resolve(status);
        dto.setName(localized.name());
        dto.setDescription(localized.description());
        dto.setLanguageId(localized.languageId());
        return dto;
    }
}
