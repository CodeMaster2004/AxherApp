package com.axher.backend.support.reports.DTOS;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProblemReportRequestDto {

    private Integer reportCategoryId;
    private String description;
    private Integer contentId;
    private Integer episodeId; 
}
