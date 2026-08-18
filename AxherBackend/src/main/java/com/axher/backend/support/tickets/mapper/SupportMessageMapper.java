package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportMessageResponseDto;
import com.axher.backend.support.tickets.entities.SupportMessage;

@Component
public class SupportMessageMapper {

    public SupportMessageResponseDto toDto(SupportMessage message){

        SupportMessageResponseDto dto = new SupportMessageResponseDto();

        dto.setMessageId(message.getMessageId());
        dto.setMessage(message.getMessage());
        dto.setSenderType(message.getSenderType());

        if (message.getSenderUser() != null) {
            dto.setSenderUserId(
                message.getSenderUser().getUserId()
            );
        }

        dto.setSentAt(message.getSentAt());

        return dto;
    }
    
}
