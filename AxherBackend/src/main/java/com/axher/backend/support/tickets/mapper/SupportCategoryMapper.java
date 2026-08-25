package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportCategoryResponseDto;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.service.SupportCategoryLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SupportCategoryMapper {

    private final SupportCategoryLocalizationService localizationService;

    public SupportCategoryResponseDto toDto(SupportCategory category) {
        SupportCategoryResponseDto dto = new SupportCategoryResponseDto();
        dto.setSupportCategoryId(category.getSupportCategoryId());
        dto.setCode(category.getCode());
        var localized = localizationService.resolve(category);
        dto.setName(localized.name());
        dto.setDescription(localized.description());
        dto.setLanguageId(localized.languageId());
        return dto;
    }
    
}
