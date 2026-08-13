package com.axher.backend.catalog.watchlist.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.catalog.watchlist.DTOs.WatchlistResponseDto;
import com.axher.backend.catalog.watchlist.entities.Watchlist;

@Component
public class WatchlistMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public WatchlistResponseDto toDto(Watchlist watchlist) {

        WatchlistResponseDto dto = new WatchlistResponseDto();

        dto.setWatchlistId(watchlist.getWatchlistId());
        dto.setContentId(watchlist.getContent().getContentId());
        dto.setTitle(watchlist.getContent().getTitle());
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
