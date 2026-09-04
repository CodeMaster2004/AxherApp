package com.axher.backend.content.people.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CinematicRoleTranslationDto {

    private Integer cinematicRoleId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
    private String description;
}

