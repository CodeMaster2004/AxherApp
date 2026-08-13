package com.axher.backend.catalog.shelf.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.catalog.shelf.DTOs.ShelfItemDto;
import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.core.DTOs.TrendingContentDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.mapper.ContentMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ShelfItemMapper {

    private final ContentMapper contentMapper;

    public ShelfItemDto fromContent(Content content) {

        ShelfItemDto dto = new ShelfItemDto();

        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setPosterUrl(
            contentMapper.buildUrl(content.getPosterUrl())
        );
        dto.setBackdropUrl(
            contentMapper.buildUrl(content.getBackdropUrl())
        );
        dto.setType(content.getType());

        return dto;
    }

    public ShelfItemDto fromTrending(TrendingContentDto content) {
        ShelfItemDto dto = new ShelfItemDto();
        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setPosterUrl(content.getPosterUrl());       
        dto.setType(content.getType());

        return dto;
    }

    public ShelfItemDto fromTopRated(TopRatedContentDto content) {
        ShelfItemDto dto = new ShelfItemDto();
        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setPosterUrl(content.getPosterUrl());       
        dto.setType(content.getType());

        return dto;
    }
    
}
