package com.axher.backend.catalog.shelf.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShelfContentDto {

    private Integer shelfContentId;

    private Integer contentId;

    private String title;

    private String posterUrl;

    private Integer position;
    
}
