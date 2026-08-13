package com.axher.backend.catalog.banner.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HeroRankedCandidateDto {

    private Integer contentId;
    private double score;
    private HeroCandidateMetricsDto metrics;
    
}
