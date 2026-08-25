package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportTicketStatusResponseDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.service.SupportTicketStatusLocalizationService;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class SupportTicketStatusMapper {

    private final SupportTicketStatusLocalizationService localizationService;

    public SupportTicketStatusResponseDto toDto(SupportTicketStatus status) {
        SupportTicketStatusResponseDto dto = new SupportTicketStatusResponseDto();
        dto.setSupportTicketStatusId(status.getSupportTicketStatusId());
        dto.setCode(status.getCode());
        var localizedStatus =
                localizationService.resolve(status);
        dto.setName(localizedStatus.name());
        dto.setDescription(localizedStatus.description());
        dto.setLanguageId(localizedStatus.languageId());
        return dto;
    }
    
}
