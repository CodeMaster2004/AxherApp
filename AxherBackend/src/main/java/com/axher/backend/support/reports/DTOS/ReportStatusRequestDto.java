package com.axher.backend.support.reports.DTOS;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportStatusRequestDto {
    private String code;
    private String name;
    private String description;
    
}
