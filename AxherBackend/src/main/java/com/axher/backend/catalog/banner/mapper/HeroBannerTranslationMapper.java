package com.axher.backend.catalog.banner.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.banner.DTOs.HeroBannerTranslationDto;
import com.axher.backend.catalog.banner.entities.HeroBannerTranslation;

@Component
public class HeroBannerTranslationMapper {

    public HeroBannerTranslationDto toDto(
            HeroBannerTranslation translation
    ) {

        HeroBannerTranslationDto dto =
                new HeroBannerTranslationDto();

        dto.setHeroBannerId(
                translation.getHeroBanner()
                        .getHeroBannerId()
        );

        dto.setLanguageId(
                translation.getLanguage()
                        .getLanguageId()
        );

        dto.setLanguageCode(
                translation.getLanguage()
                        .getCode()
        );

        dto.setLanguageName(
                translation.getLanguage()
                        .getName()
        );

        dto.setTitleOverride(
                translation.getTitleOverride()
        );

        dto.setDescriptionOverride(
                translation.getDescriptionOverride()
        );

        return dto;
    }
}
