package com.axher.backend.catalog.shelf.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ShelfItemDto;
import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.core.DTOs.TopRatedContentResult;
import com.axher.backend.content.core.DTOs.TrendingContentDto;
import com.axher.backend.content.core.DTOs.TrendingContentResult;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.mapper.ContentMapper;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ShelfItemMapper {

    private final ContentMapper contentMapper;
    private final ContentLocalizationService localizationService;

    public ShelfItemDto fromContent(Content content) {

        ContentLocalizationService.LocalizedContent localized =
                localizationService.resolve(content);

        ShelfItemDto dto = new ShelfItemDto();

        dto.setContentId(content.getContentId());

        dto.setTitle(localized.title());

        dto.setPosterUrl(
            contentMapper.buildUrl(content.getPosterUrl())
        );

        dto.setBackdropUrl(
            contentMapper.buildUrl(content.getBackdropUrl())
        );

        dto.setType(content.getType());

        return dto;
    }

    public ShelfItemDto fromTrending(
            TrendingContentResult result
    ) {

        Content content = result.content();

        ContentLocalizationService.LocalizedContent localized =
                localizationService.resolve(content);

        ShelfItemDto dto = new ShelfItemDto();

        dto.setContentId(content.getContentId());

        dto.setTitle(localized.title());

        dto.setPosterUrl(
            contentMapper.buildUrl(content.getPosterUrl())
        );

        dto.setType(content.getType());

        return dto;
    }

    public ShelfItemDto fromTopRated(TopRatedContentResult result) {
        Content content = result.content();

        ContentLocalizationService.LocalizedContent localized =
                localizationService.resolve(content);

        ShelfItemDto dto = new ShelfItemDto();
        dto.setContentId(content.getContentId());
        dto.setTitle(localized.title());
        dto.setPosterUrl(content.getPosterUrl());       
        dto.setType(content.getType());

        return dto;
    }
    
}
