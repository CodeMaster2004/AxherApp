package com.axher.backend.catalog.page.DTOs;

import com.axher.backend.catalog.page.entities.PageSectionType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PageSectionUpdateDto {

    private PageSectionType type;
    private Boolean active;
    private Integer contentShelfId;
    private Integer displayOrder;
    
}
