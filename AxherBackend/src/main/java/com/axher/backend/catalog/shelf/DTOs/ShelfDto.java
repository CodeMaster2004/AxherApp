package com.axher.backend.catalog.shelf.DTOs;

import java.util.List;

import com.axher.backend.content.core.DTOs.ContentDetailDto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ShelfDto {

    private String name;

    private String slug;

    private List<ContentDetailDto> contents;
    
}
