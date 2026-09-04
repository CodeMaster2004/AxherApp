package com.axher.backend.catalog.banner.DTOs;

import java.time.Instant;

import lombok.Data;

@Data
public class HeroBannerDto {

    private Integer heroBannerId;
    private Integer contentId;
    private String contentTitle;
    private String titleOverride;
    private String descriptionOverride;
    private String backdropUrl;
    private Integer priority;
    private Instant startDate;
    private Instant endDate;
    private Boolean active;
    private Instant createdAt;
    private Integer languageId;    
}
