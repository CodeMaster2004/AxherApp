package com.axher.backend.catalog.watchlist.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.watchlist.DTOs.WatchlistResponseDto;
import com.axher.backend.catalog.watchlist.entities.Watchlist;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WatchlistMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService contentLocalizationService;

    public WatchlistResponseDto toDto(Watchlist watchlist) {

        var content = watchlist.getContent();

        var localized =
                contentLocalizationService.resolve(content);

        WatchlistResponseDto dto = new WatchlistResponseDto();

        dto.setWatchlistId(watchlist.getWatchlistId());
        dto.setContentId(watchlist.getContent().getContentId());
        dto.setTitle(localized.title());
        dto.setPosterUrl(buildUrl(watchlist.getContent().getPosterUrl()));
        dto.setType(watchlist.getContent().getType());
        dto.setAddedAt(watchlist.getAddedAt());

        return dto;
    }

    private String buildUrl(String path) {

        if(path == null) return null;
        return baseUrl + path;
    }
    
}
