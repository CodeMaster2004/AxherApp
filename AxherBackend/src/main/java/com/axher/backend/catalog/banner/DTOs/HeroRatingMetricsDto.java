package com.axher.backend.catalog.banner.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HeroRatingMetricsDto {

    private Integer contentId;
    private Double averageRating;
    private Long totalRatings;
}
