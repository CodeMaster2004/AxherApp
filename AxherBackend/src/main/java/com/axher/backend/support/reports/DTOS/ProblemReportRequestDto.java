package com.axher.backend.support.reports.DTOS;

import com.axher.backend.support.reports.entities.ProblemReportCategory;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemReportRequestDto {

    private ProblemReportCategory category;
    private String description;
    private Integer contentId;
    private Integer episodeId; 
}
