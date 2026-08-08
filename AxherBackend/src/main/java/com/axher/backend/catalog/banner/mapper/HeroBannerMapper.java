package com.axher.backend.catalog.banner.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.banner.DTOs.HeroBannerDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;

@Component
public class HeroBannerMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public HeroBannerDto toDto(HeroBanner banner) {
        HeroBannerDto dto = new HeroBannerDto();
        dto.setHeroBannerId(banner.getHeroBannerId());
        dto.setContentId(banner.getContent().getContentId());
        dto.setContentId(
            banner.getContent().getContentId()
        );
        dto.setTitleOverride(banner.getTitleOverride());
        dto.setDescriptionOverride(banner.getDescriptionOverride());
        dto.setBackdropUrl(buildUrl(banner.getBackdropUrl()));
        dto.setPriority(banner.getPriority());
        dto.setStartDate(banner.getStartDate());
        dto.setEndDate(banner.getEndDate());
        dto.setActive(banner.getActive());
        dto.setCreatedAt(banner.getCreatedAt());
        return dto;
    }

    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}
