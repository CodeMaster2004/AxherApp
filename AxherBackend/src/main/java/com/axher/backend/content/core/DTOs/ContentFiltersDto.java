package com.axher.backend.content.core.DTOs;

import java.util.List;

import lombok.Data;

@Data
public class ContentFiltersDto {

    private List<CategoryDto> categories;
    private List<Integer> years;
    
}
