package com.axher.backend.catalog.banner.DTOs;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HeroBannerRequestDto {

    private Integer contentId;
    private String titleOverride;
    private String descriptionOverride;
    private MultipartFile backdropFile;
    private Integer priority;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
    
}
