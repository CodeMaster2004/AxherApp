package com.axher.backend.content.core.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentTranslationDto {

    private Integer contentId; 
    private Integer languageId;
    private String languageCode; 
    private String languageName;
    private String title; 
    private String description;
    
}
