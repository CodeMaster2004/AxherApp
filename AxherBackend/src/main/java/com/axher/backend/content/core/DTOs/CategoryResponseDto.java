package com.axher.backend.content.core.DTOs;

import lombok.Data;

@Data
public class CategoryResponseDto {

    private Integer contentCategoryId;
    private String slug;
    private String name;
    private String description;
    private Integer languageId;
    
}
