package com.axher.backend.catalog.shelf.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ShelfContentDto;
import com.axher.backend.catalog.shelf.entities.ShelfContent;

@Component
public class ShelfContentMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public ShelfContentDto toDto(ShelfContent shelfContent) {
        ShelfContentDto dto = new ShelfContentDto();
        dto.setShelfContentId(shelfContent.getShelfContentId());
        dto.setContentId(shelfContent.getContent().getContentId());
        dto.setTitle(shelfContent.getContent().getTitle());
        dto.setPosterUrl(buildUrl(shelfContent.getContent().getPosterUrl()));
        dto.setPosition(shelfContent.getPosition());
        return dto;
    }
    
    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
}
