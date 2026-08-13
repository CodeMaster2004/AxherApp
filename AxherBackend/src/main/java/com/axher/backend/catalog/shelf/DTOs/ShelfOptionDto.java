package com.axher.backend.catalog.shelf.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShelfOptionDto {

    private Integer contentShelfId;
    private String name;
    private String slug;
    
}
