package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ReportStatusResponseDto;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.service.ReportStatusLocalizationService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReportStatusMapper {

    private final ReportStatusLocalizationService localizationService;

    public ReportStatusResponseDto toDto(ReportStatus status) {
        ReportStatusResponseDto dto = new ReportStatusResponseDto();
        dto.setReportStatusId(status.getReportStatusId());
        dto.setCode(status.getCode());
        var localizedStatus =
                localizationService.resolve(status);
        dto.setName(localizedStatus.name());
        dto.setDescription(localizedStatus.description());
        dto.setLanguageId(localizedStatus.languageId());
        return dto;
    }
    
}
