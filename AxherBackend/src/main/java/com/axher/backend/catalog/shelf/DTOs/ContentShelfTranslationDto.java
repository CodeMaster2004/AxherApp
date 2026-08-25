package com.axher.backend.catalog.shelf.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentShelfTranslationDto {

    private Integer contentShelfId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
}