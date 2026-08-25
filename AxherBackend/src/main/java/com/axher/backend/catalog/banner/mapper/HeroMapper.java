package com.axher.backend.catalog.banner.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.service.HeroBannerLocalizationService;
import com.axher.backend.content.core.DTOs.HeroContentDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class HeroMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService contentLocalizationService;
    private final HeroBannerLocalizationService localizationService;

    public HeroContentDto toDto(Content content) {
        HeroContentDto dto = new HeroContentDto();
        var localized =
                contentLocalizationService.resolve(content);

        dto.setContentId(content.getContentId());
        dto.setTitle(localized.title());
        dto.setDescription(localized.description());
        dto.setBackdropUrl(buildUrl(content.getBackdropUrl()));
        dto.setTrailerUrl(buildUrl(content.getTrailerUrl()));
        dto.setType(content.getType());
        
        return dto;
    }

    public HeroContentDto toDto(HeroBanner banner) {
        Content content = banner.getContent();

        var contentLocalized =
                contentLocalizationService.resolve(content);

        var bannerLocalized =
                localizationService.resolve(banner);

        HeroContentDto dto = new HeroContentDto();


        dto.setContentId(content.getContentId());
        dto.setTitle(
                bannerLocalized.titleOverride() != null
                        && !bannerLocalized.titleOverride().isBlank()
                        ? bannerLocalized.titleOverride()
                        : contentLocalized.title()
        );
        dto.setDescription(
                bannerLocalized.descriptionOverride() != null
                        && !bannerLocalized.descriptionOverride().isBlank()
                        ? bannerLocalized.descriptionOverride()
                        : contentLocalized.description()
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
