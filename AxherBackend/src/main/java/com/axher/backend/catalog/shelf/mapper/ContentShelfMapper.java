package com.axher.backend.catalog.shelf.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;

@Component
public class ContentShelfMapper {

    public ContentShelfDto toDto(ContentShelf shelf) {

        ContentShelfDto dto = new ContentShelfDto();

        dto.setContentShelfId(shelf.getContentShelfId());
        dto.setName(shelf.getName());
        dto.setSlug(shelf.getSlug());
        dto.setTarget(shelf.getTarget());
        dto.setLayout(shelf.getLayout());
        dto.setSource(shelf.getSource());
        dto.setActive(shelf.getActive());
        dto.setCreatedAt(shelf.getCreatedAt());

        return dto;
    }
    
}
