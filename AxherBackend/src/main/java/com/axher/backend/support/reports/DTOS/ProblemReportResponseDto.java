package com.axher.backend.support.reports.DTOS;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemReportResponseDto {

    private Integer reportId;
    private Integer reportCategoryId;
    private String reportCategoryCode;
    private String reportCategoryName;
    private String description;
    private Integer contentId;
    private Integer episodeId;
    private Integer reportStatusId;
    private String reportStatusCode;
    private String reportStatusName;
    private Instant reportedAt;
    private Instant resolvedAt;
    
}
