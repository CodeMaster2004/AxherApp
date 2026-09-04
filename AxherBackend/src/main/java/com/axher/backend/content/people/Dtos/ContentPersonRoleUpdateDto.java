package com.axher.backend.content.people.Dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentPersonRoleUpdateDto {
    private Integer personId;

    private Integer cinematicRoleId;

    @Size(max = 100)
    private String characterName;

    @Min(0)
    private Integer orderIndex;
}
