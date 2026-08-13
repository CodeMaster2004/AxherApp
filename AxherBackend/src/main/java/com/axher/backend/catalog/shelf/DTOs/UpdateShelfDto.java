package com.axher.backend.catalog.shelf.DTOs;

import com.axher.backend.catalog.shelf.entities.ShelfLayout;
import com.axher.backend.catalog.shelf.entities.ShelfSource;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateShelfDto {
    
    private String name;
    private String slug;
    private ShelfTarget target;
    private ShelfSource source;
    private ShelfLayout layout;
    private Boolean active;
}
