package com.axher.backend.catalog.watchlist.DTOs;

import java.time.LocalDateTime;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WatchlistResponseDto {

    private Integer watchlistId;
    private Integer contentId;
    private String title;
    private String posterUrl;
    private ContentTypeEnum type;
    private LocalDateTime addedAt;
    
}
