package com.axher.backend.catalog.shelf.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.service.ContentShelfLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ContentShelfMapper {

    private final ContentShelfLocalizationService localizationService;

    public ContentShelfDto toDto(ContentShelf shelf) {

        ContentShelfDto dto = new ContentShelfDto();

        var localized = localizationService.resolve(shelf);

        dto.setContentShelfId(shelf.getContentShelfId());
        dto.setName(localized.name());
        dto.setSlug(shelf.getSlug());
        dto.setTarget(shelf.getTarget());
        dto.setLayout(shelf.getLayout());
        dto.setSource(shelf.getSource());
        dto.setActive(shelf.getActive());
        dto.setCreatedAt(shelf.getCreatedAt());
        dto.setLanguageId(localized.languageId());

        return dto;
    }
    
}
