package com.axher.backend.support.reports.DTOS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportCategoryTranslationRequestDto {

    private Integer languageId;
    private String name;
    private String description;
}
