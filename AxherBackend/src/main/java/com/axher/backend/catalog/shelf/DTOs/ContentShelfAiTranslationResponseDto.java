package com.axher.backend.catalog.shelf.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentShelfAiTranslationResponseDto {

    private Integer sourceLanguageId;

    private Integer targetLanguageId;

    private String sourceName;

    private String translatedName;
}
