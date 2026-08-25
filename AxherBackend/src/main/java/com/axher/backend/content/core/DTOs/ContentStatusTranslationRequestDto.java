package com.axher.backend.content.core.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContentStatusTranslationRequestDto {

    private Integer languageId;
    private String name;
    private String description;
}
