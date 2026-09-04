package com.axher.backend.content.people.Dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentPersonRoleResponseDto {

    private Long contentPersonRoleId;
    private Integer personId;
    private String personName;
    private String personPhoto;
    private Integer cinematicRoleId;
    private String cinematicRoleCode;
    private String cinematicRoleName;
    private String characterName;
    private Integer orderIndex;
    
}
