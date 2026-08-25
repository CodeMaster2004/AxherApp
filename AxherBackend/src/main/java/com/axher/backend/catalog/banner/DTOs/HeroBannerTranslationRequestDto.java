package com.axher.backend.catalog.banner.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeroBannerTranslationRequestDto {

    private Integer languageId;
    private String titleOverride;
    private String descriptionOverride;
}
