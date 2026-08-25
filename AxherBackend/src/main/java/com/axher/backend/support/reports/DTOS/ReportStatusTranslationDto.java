package com.axher.backend.support.reports.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportStatusTranslationDto {

    private Integer reportStatusId;
    private Integer languageId;
    private String languageCode;
    private String languageName;
    private String name;
    private String description;

}