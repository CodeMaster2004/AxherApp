package com.axher.backend.support.reports.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.reports.DTOS.ReportStatusResponseDto;
import com.axher.backend.support.reports.entities.ReportStatus;

@Component
public class ReportStatusMapper {

    public ReportStatusResponseDto toDto(ReportStatus status) {
        ReportStatusResponseDto dto = new ReportStatusResponseDto();
        dto.setReportStatusId(status.getReportStatusId());
        dto.setCode(status.getCode());
        dto.setName(status.getName());
        dto.setDescription(status.getDescription());
        return dto;
    }
    
}
