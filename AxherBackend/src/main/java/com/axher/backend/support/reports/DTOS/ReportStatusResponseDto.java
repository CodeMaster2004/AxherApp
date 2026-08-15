package com.axher.backend.support.reports.DTOS;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportStatusResponseDto {
    private Integer reportStatusId;
    private String code;
    private String name;
    private String description;
}
