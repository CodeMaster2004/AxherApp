package com.axher.backend.catalog.banner.DTOs;

import java.time.Instant;

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
    private Instant startDate;
    private Instant endDate;
    private Boolean active;
    private Integer languageId;
    
}
