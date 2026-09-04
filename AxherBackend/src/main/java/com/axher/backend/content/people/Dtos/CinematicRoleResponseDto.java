package com.axher.backend.content.people.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CinematicRoleResponseDto {

    private Integer cinematicRoleId;
    private String code;
    private String name;
    private String description;
    private Integer languageId;
}

