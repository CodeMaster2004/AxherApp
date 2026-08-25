package com.axher.backend.content.core.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentStatusTranslationDto {

    private Integer contentStatusId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
    private String description;
}