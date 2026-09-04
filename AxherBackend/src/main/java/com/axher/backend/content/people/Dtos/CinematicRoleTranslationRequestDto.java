package com.axher.backend.content.people.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CinematicRoleTranslationRequestDto {

    private Integer languageId;
    private String name;
    private String description;
}

