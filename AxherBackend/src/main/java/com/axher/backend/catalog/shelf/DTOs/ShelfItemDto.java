package com.axher.backend.catalog.shelf.DTOs;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShelfItemDto {

    private Integer contentId;
    private String title;
    private String posterUrl;
    private String backdropUrl;
    private ContentTypeEnum type;
    
}
