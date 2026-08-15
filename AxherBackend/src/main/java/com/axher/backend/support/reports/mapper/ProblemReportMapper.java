package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ProblemReportResponseDto;
import com.axher.backend.support.reports.entities.ProblemReport;

@Component
public class ProblemReportMapper {
    
    public ProblemReportResponseDto toDto(ProblemReport report){
        ProblemReportResponseDto dto = new ProblemReportResponseDto();
        dto.setReportId(report.getReportId());
        if (report.getCategory() != null) {
            dto.setCategory(
                report.getCategory().name()
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
            dto.setReportStatusId(
                report.getReportStatus().getReportStatusId()
            );
            dto.setReportStatusCode(
                report.getReportStatus().getCode()
            );
            dto.setReportStatusName(
                report.getReportStatus().getName()
            );
        }
        dto.setReportedAt(report.getReportedAt());
        dto.setResolvedAt(report.getResolvedAt());
        return dto;
    }
}
