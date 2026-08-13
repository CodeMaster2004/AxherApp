package com.axher.backend.catalog.banner.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HeroPlaybackMetricsDto {

    private Integer contentId;
    private Long totalViews7d;
    private Long uniqueUsers7d;
}
