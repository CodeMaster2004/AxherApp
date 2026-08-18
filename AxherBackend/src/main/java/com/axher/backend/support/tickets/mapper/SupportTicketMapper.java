package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportTicketResponseDto;
import com.axher.backend.support.tickets.entities.SupportTicket;

@Component
public class SupportTicketMapper {

    public SupportTicketResponseDto toDto(SupportTicket ticket) {

        SupportTicketResponseDto dto = new SupportTicketResponseDto();

        dto.setSupportTicketId(ticket.getSupportTicketId());
        dto.setSubject(ticket.getSubject());
        if (ticket.getUser() != null) {
            dto.setUserId(
                ticket.getUser().getUserId()
            );
        }
        if(ticket.getSupportCategory() != null){
            dto.setSupportCategoryId(
                ticket.getSupportCategory().getSupportCategoryId()
            );

            dto.setSupportCategoryCode(
                ticket.getSupportCategory().getCode()
            );
            dto.setSupportCategoryName(
                ticket.getSupportCategory().getName()
            );
        }

        if(ticket.getSupportTicketStatus() != null){

            dto.setSupportTicketStatusId(
                ticket.getSupportTicketStatus().getSupportTicketStatusId()
            );
            
            dto.setSupportTicketStatusCode(
                ticket.getSupportTicketStatus().getCode()
            );
            dto.setSupportTicketStatusName(
                ticket.getSupportTicketStatus().getName()
            );
        }

        if(ticket.getSubscription() != null){
            dto.setSubscriptionId(
                ticket.getSubscription().getSubscriptionId()
            );
        }

        if (ticket.getSubscriptionPayment() != null) {

            dto.setSubscriptionPaymentId(
                ticket.getSubscriptionPayment()
                    .getSubscriptionPaymentId()
            );
        }

        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());
        dto.setResolvedAt(ticket.getResolvedAt());
        dto.setClosedAt(ticket.getClosedAt());

        return dto;
    }
    
}
