package com.axher.backend.catalog.banner.DTOs;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class HeroCandidateMetricsDto {

    private Integer contentId;
    private Long totalViews7d;
    private Long uniqueUsers7d;
    private Double averageRating;
    private Long totalRatings;
    private LocalDate releaseDate;
}
