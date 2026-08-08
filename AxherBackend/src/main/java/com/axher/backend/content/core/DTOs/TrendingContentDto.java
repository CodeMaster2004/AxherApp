package com.axher.backend.content.core.DTOs;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TrendingContentDto {
    private Integer contentId;

    private String title;

    private String posterUrl;
    private ContentTypeEnum type;
    private Long totalViews;

    private Long uniqueUsers;

    private Long totalWatchedSeconds;

    private Double score;
}
