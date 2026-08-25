package com.axher.backend.catalog.banner.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeroBannerTranslationDto {

    private Integer heroBannerId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String titleOverride;
    private String descriptionOverride;
}