package com.axher.backend.content.people.Dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class CinematicRoleAiTranslationResponseDto {

    private Integer sourceLanguageId;
    private Integer targetLanguageId;
    private String sourceName;
    private String sourceDescription;
    private String translatedName;
    private String translatedDescription;
}
