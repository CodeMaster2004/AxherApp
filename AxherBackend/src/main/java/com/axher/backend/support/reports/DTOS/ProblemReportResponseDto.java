package com.axher.backend.support.reports.DTOS;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemReportResponseDto {

    private Integer reportId;
    private String category;
    private String description;
    private Integer contentId;
    private Integer episodeId;
    private Integer reportStatusId;
    private String reportStatusCode;
    private String reportStatusName;
    private LocalDateTime reportedAt;
    private LocalDateTime resolvedAt;
    
}
