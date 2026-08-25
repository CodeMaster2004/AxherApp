package com.axher.backend.catalog.banner.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.banner.DTOs.HeroBannerDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.service.HeroBannerLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class HeroBannerMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final HeroBannerLocalizationService localizationService;

    public HeroBannerDto toDto(HeroBanner banner) {
        HeroBannerDto dto = new HeroBannerDto();
        dto.setHeroBannerId(banner.getHeroBannerId());
        dto.setContentId(banner.getContent().getContentId());
        dto.setContentId(
            banner.getContent().getContentId()
        );
        var localized = localizationService.resolve(banner);
        dto.setTitleOverride(localized.titleOverride());
        dto.setDescriptionOverride(localized.descriptionOverride());
        dto.setBackdropUrl(buildUrl(banner.getBackdropUrl()));
        dto.setPriority(banner.getPriority());
        dto.setStartDate(banner.getStartDate());
        dto.setEndDate(banner.getEndDate());
        dto.setActive(banner.getActive());
        dto.setCreatedAt(banner.getCreatedAt());
        dto.setLanguageId(localized.languageId());
        return dto;
    }

    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}
