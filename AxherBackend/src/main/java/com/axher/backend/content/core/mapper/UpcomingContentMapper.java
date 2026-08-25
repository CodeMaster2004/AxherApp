package com.axher.backend.content.core.mapper;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.UpcomingContentDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.service.ContentCategoryLocalizationService;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UpcomingContentMapper {
    
    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService contentLocalizationService;
    private final ContentCategoryLocalizationService contentCategoryLocalizationService;

    public UpcomingContentDto toDto(Content content) {
        
        UpcomingContentDto dto = new UpcomingContentDto();

        ContentLocalizationService.LocalizedContent localized =
                contentLocalizationService.resolve(content);

        dto.setContentId(content.getContentId());
        dto.setTitle(localized.title());
        dto.setPosterUrl(buildUrl(content.getPosterUrl()));
        dto.setBackdropUrl(buildUrl(content.getBackdropUrl()));
        dto.setDescription(localized.description());
        dto.setReleaseDate(content.getReleaseDate().toString());
        dto.setCategories(
            content.getCategories()
                .stream()
                .map(category ->
                    contentCategoryLocalizationService
                        .resolve(category)
                        .name()
                )
                .toList()
        );
        dto.setType(content.getType());
        return dto;
    }

    private String buildUrl(String path) {

        if(path == null) return null;
        return baseUrl + path;
    }
}
