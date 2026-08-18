package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportTicketStatusResponseDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;


@Component
public class SupportTicketStatusMapper {

    public SupportTicketStatusResponseDto toDto(SupportTicketStatus status) {
        SupportTicketStatusResponseDto dto = new SupportTicketStatusResponseDto();
        dto.setSupportTicketStatusId(status.getSupportTicketStatusId());
        dto.setCode(status.getCode());
        dto.setName(status.getName());
        dto.setDescription(status.getDescription());
        return dto;
    }
    
}
