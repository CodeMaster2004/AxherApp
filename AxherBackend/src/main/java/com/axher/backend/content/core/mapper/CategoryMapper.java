package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.CategoryDto;
import com.axher.backend.content.core.entities.ContentCategories;

@Component
public class CategoryMapper {

    public CategoryDto toDto(ContentCategories category) {

        CategoryDto dto = new CategoryDto();

        dto.setCategoryId(category.getContentCategoryId());
        dto.setSlug(category.getSlug());
        dto.setName(category.getName());

        return dto;
    }
    
}
