package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ProblemReportResponseDto;
import com.axher.backend.support.reports.entities.ProblemReport;
import com.axher.backend.support.reports.service.ReportCategoryLocalizationService;
import com.axher.backend.support.reports.service.ReportStatusLocalizationService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProblemReportMapper {

    private final ReportStatusLocalizationService reportStatusLocalizationService;
    private final ReportCategoryLocalizationService reportCategoryLocalizationService;
    
    public ProblemReportResponseDto toDto(ProblemReport report){
        ProblemReportResponseDto dto = new ProblemReportResponseDto();
        dto.setReportId(report.getReportId());
        if (report.getCategory() != null) {
            var localizedCategory =
                    reportCategoryLocalizationService.resolve(
                            report.getCategory()
                    );
            dto.setCategory(
                localizedCategory.name()
            );
        }
        dto.setDescription(report.getDescription());
        if (report.getContent() != null) {
            dto.setContentId(
                report.getContent().getContentId()
            );
        }
        if(report.getEpisode() != null){
            dto.setEpisodeId(
                report.getEpisode().getEpisodeId()
            );
        }
        if(report.getReportStatus() != null){
            var localizedStatus =
                    reportStatusLocalizationService.resolve(
                            report.getReportStatus()
                    );
            dto.setReportStatusId(
                report.getReportStatus().getReportStatusId()
            );
            dto.setReportStatusCode(
                report.getReportStatus().getCode()
            );
            dto.setReportStatusName(
                localizedStatus.name()
            );
        }
        dto.setReportedAt(report.getReportedAt());
        dto.setResolvedAt(report.getResolvedAt());
        return dto;
    }
}
