package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ReportCategoryTranslationDto;
import com.axher.backend.support.reports.entities.ReportCategoryTranslation;

@Component
public class ReportCategoryTranslationMapper {

    public ReportCategoryTranslationDto toDto(
            ReportCategoryTranslation translation
    ) {

        ReportCategoryTranslationDto dto =
                new ReportCategoryTranslationDto();

        dto.setReportCategoryId(
                translation.getReportCategory()
                        .getReportCategoryId()
        );

        dto.setLanguageId(
                translation.getLanguage()
                        .getLanguageId()
        );

        dto.setLanguageCode(
                translation.getLanguage()
                        .getCode()
        );

        dto.setLanguageName(
                translation.getLanguage()
                        .getName()
        );

        dto.setName(
                translation.getName()
        );

        dto.setDescription(
                translation.getDescription()
        );

        return dto;
    }
}
