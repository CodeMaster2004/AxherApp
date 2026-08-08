package com.axher.backend.catalog.banner.DTOs;

import java.time.LocalDateTime;

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
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
    private LocalDateTime createdAt;
    
}
