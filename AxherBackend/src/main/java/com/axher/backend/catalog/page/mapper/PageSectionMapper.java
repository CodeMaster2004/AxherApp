package com.axher.backend.catalog.page.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.page.DTOs.PageSectionDto;
import com.axher.backend.catalog.page.entities.PageSection;
import com.axher.backend.catalog.shelf.service.ContentShelfLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PageSectionMapper {

    private final ContentShelfLocalizationService contentShelfLocalizationService;

    public PageSectionDto toDto(PageSection section) {
        PageSectionDto dto = new PageSectionDto();
        dto.setPageSectionId(section.getPageSectionId());
        dto.setPage(section.getPage());
        dto.setType(section.getType());
        dto.setDisplayOrder(section.getDisplayOrder());
        dto.setActive(section.getActive());
        if (section.getContentShelf() != null) {
            dto.setContentShelfId(
                section.getContentShelf().getContentShelfId()
            );
            var localized = contentShelfLocalizationService.resolve(section.getContentShelf());
            dto.setContentShelfName(
                localized.name()
            );
        }
        return dto;
    }
    
}
