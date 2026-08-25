package com.axher.backend.content.core.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentTranslationRequestDto {
    private Integer languageId;
    private String title;
    private String description;
}
