package com.axher.backend.catalog.page.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.page.DTOs.PageSectionDto;
import com.axher.backend.catalog.page.entities.PageSection;

@Component
public class PageSectionMapper {

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
            dto.setContentShelfName(
                section.getContentShelf().getName()
            );
        }
        return dto;
    }
    
}
