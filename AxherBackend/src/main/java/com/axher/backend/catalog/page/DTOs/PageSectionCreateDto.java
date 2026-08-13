package com.axher.backend.catalog.page.DTOs;

import com.axher.backend.catalog.page.entities.PageSectionType;
import com.axher.backend.catalog.page.entities.PageType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PageSectionCreateDto {

    private PageType page;
    private PageSectionType type;
    private Integer displayOrder;
    private Boolean active;
    private Integer contentShelfId;
    
}
