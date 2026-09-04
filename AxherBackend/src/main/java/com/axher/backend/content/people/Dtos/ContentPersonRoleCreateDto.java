package com.axher.backend.content.people.Dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentPersonRoleCreateDto {
    
    @NotNull
    private Integer personId;

    @NotNull
    private Integer cinematicRoleId;

    @Size(max = 100)
    private String characterName;

    @Min(1)
    private Integer orderIndex;
}
