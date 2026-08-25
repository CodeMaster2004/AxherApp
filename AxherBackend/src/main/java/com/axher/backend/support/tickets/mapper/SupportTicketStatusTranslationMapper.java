package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportTicketStatusTranslationDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatusTranslation;

@Component
public class SupportTicketStatusTranslationMapper {

    public SupportTicketStatusTranslationDto toDto(
            SupportTicketStatusTranslation translation
    ) {

        SupportTicketStatusTranslationDto dto =
                new SupportTicketStatusTranslationDto();

        dto.setSupportTicketStatusId(
                translation.getSupportTicketStatus()
                        .getSupportTicketStatusId()
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
