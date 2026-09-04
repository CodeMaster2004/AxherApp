package com.axher.backend.catalog.banner.DTOs;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HeroBannerResponseDto {

    private Integer heroBannerId;
    private Integer contentId;
    private String title;
    private String description;
    private String backdropUrl;
    private Integer priority;
    private Instant startDate;
    private Instant endDate;
    private Boolean active;
    
    
}
