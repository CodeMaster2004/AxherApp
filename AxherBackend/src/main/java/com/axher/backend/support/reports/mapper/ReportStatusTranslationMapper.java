package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ReportStatusTranslationDto;
import com.axher.backend.support.reports.entities.ReportStatusTranslation;

@Component
public class ReportStatusTranslationMapper {

    public ReportStatusTranslationDto toDto(
            ReportStatusTranslation translation
    ) {

        ReportStatusTranslationDto dto =
                new ReportStatusTranslationDto();

        dto.setReportStatusId(
                translation.getReportStatus()
                        .getReportStatusId()
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
