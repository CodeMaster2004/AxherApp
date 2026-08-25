package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.CategoryResponseDto;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.service.ContentCategoryLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoryMapper {

    private final ContentCategoryLocalizationService contentCategoryLocalizationService;

    public CategoryResponseDto toDto(ContentCategories category) {

        CategoryResponseDto dto = new CategoryResponseDto();

        ContentCategoryLocalizationService.LocalizedCategory localized =
                contentCategoryLocalizationService.resolve(category);

        dto.setContentCategoryId(category.getContentCategoryId());
        dto.setSlug(category.getSlug());
        dto.setName(localized.name());
        dto.setDescription(localized.description());
        dto.setLanguageId(localized.languageId());

        return dto;
    }
    
}
