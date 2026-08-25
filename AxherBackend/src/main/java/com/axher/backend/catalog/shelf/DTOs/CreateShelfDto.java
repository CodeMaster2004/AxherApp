package com.axher.backend.catalog.shelf.DTOs;

import com.axher.backend.catalog.shelf.entities.ShelfLayout;
import com.axher.backend.catalog.shelf.entities.ShelfSource;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateShelfDto {
    
    @NotBlank
    private String name;

    @NotNull
    private ShelfTarget target;
    @NotNull
    private ShelfSource source;
    private ShelfLayout layout;


    private Boolean active = true;
    private Integer languageId;
}
