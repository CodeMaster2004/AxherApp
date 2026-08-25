package com.axher.backend.support.reports.DTOS;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportCategoryResponseDto {

    private Integer reportCategoryId;
    private String code;
    private String name;
    private String description;
    private Integer languageId;
}