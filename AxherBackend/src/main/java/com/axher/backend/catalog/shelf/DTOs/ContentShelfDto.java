package com.axher.backend.catalog.shelf.DTOs;

import java.time.Instant;

import com.axher.backend.catalog.shelf.entities.ShelfLayout;
import com.axher.backend.catalog.shelf.entities.ShelfSource;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentShelfDto {

    private Integer contentShelfId;
    private String name;
    private String slug;
    private ShelfTarget target;
    private ShelfLayout layout;
    private ShelfSource source;
    private Boolean active;
    private Instant createdAt;
    private Integer languageId;
    
}
