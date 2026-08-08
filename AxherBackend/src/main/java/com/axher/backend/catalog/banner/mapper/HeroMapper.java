package com.axher.backend.catalog.banner.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.content.core.DTOs.HeroContentDto;
import com.axher.backend.content.core.entities.Content;

@Component
public class HeroMapper {

    @Value("${app.base-url}")
    private String baseUrl;


    public HeroContentDto toDto(Content content) {
        HeroContentDto dto = new HeroContentDto();
        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setDescription(content.getDescription());
        dto.setBackdropUrl(buildUrl(content.getBackdropUrl()));
        dto.setTrailerUrl(buildUrl(content.getTrailerUrl()));
        dto.setType(content.getType());
        return dto;
    }

    public HeroContentDto toDto(HeroBanner banner) {
        Content content = banner.getContent();

        HeroContentDto dto = new HeroContentDto();
        dto.setContentId(content.getContentId());
        dto.setTitle(
                banner.getTitleOverride() != null && !banner.getTitleOverride().isBlank()
                        ? banner.getTitleOverride()
                        : content.getTitle()
        );
        dto.setDescription(
                banner.getDescriptionOverride() != null && !banner.getDescriptionOverride().isBlank()
                        ? banner.getDescriptionOverride()
                        : content.getDescription()
        );
        dto.setBackdropUrl(
                banner.getBackdropUrl() != null && !banner.getBackdropUrl().isBlank()
                        ? buildUrl(banner.getBackdropUrl())
                        : buildUrl(content.getBackdropUrl())
        );
        dto.setTrailerUrl(buildUrl(content.getTrailerUrl()));
        dto.setType(content.getType());
        return dto;
    }

    private String buildUrl(String path) {
        if (path == null || path.isBlank()) {
            return null;
        }
        return baseUrl + path;
    }
}
