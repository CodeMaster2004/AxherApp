package com.axher.backend.catalog.shelf.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ShelfContentDto;
import com.axher.backend.catalog.shelf.entities.ShelfContent;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ShelfContentMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService contentLocalizationService;

    public ShelfContentDto toDto(ShelfContent shelfContent) {
        ShelfContentDto dto = new ShelfContentDto();
        var content = shelfContent.getContent();

        var localized =
                contentLocalizationService.resolve(content);

        dto.setShelfContentId(shelfContent.getShelfContentId());
        dto.setContentId(shelfContent.getContent().getContentId());
        dto.setTitle(localized.title());
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
