package com.axher.backend.content.people.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CinematicRoleRequestDto {

    private String code;
    private String name;
    private String description;
    private Integer languageId;
}
