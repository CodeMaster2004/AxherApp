package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ReportCategoryResponseDto;
import com.axher.backend.support.reports.entities.ReportCategory;
import com.axher.backend.support.reports.service.ReportCategoryLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReportCategoryMapper {

    private final ReportCategoryLocalizationService localizationService;

    public ReportCategoryResponseDto toDto(
            ReportCategory category
    ) {

        ReportCategoryResponseDto dto =
                new ReportCategoryResponseDto();

        dto.setReportCategoryId(
                category.getReportCategoryId()
        );

        dto.setCode(
                category.getCode()
        );

        var localizedCategory =
                localizationService.resolve(category);

        dto.setName(
                localizedCategory.name()
        );

        dto.setDescription(
                localizedCategory.description()
        );
        dto.setLanguageId(
                localizedCategory.languageId()
        );

        return dto;
    }
}
