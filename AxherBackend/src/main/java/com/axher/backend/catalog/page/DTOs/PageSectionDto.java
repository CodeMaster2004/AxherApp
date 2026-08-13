package com.axher.backend.catalog.page.DTOs;

import com.axher.backend.catalog.page.entities.PageSectionType;
import com.axher.backend.catalog.page.entities.PageType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PageSectionDto {

    private Integer pageSectionId;
    private PageType page;
    private PageSectionType type;
    private Integer displayOrder;
    private Boolean active;
    private Integer contentShelfId;
    private String contentShelfName;
    
}
