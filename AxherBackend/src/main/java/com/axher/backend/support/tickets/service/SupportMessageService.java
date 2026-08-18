package com.axher.backend.support.tickets.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.tickets.DTOs.SupportMessageRequestDto;
import com.axher.backend.support.tickets.entities.SenderType;
import com.axher.backend.support.tickets.entities.SupportMessage;
import com.axher.backend.support.tickets.entities.SupportTicket;
import com.axher.backend.support.tickets.repositories.SupportMessageRepository;
import com.axher.backend.support.tickets.repositories.SupportTicketRepository;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportMessageService {

    private final SupportMessageRepository repository;
    private final SupportTicketRepository supportTicketRepository;
    
    // ==============================
    // OBTENER MENSAJES DE UN TICKET
    // ==============================
    public List<SupportMessage> findAllByTicketId(Integer ticketId){

        Users user = getCurrentUser();

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket de soporte no encontrado: " + ticketId
                )
            );

        if (ticket.getUser() == null || !ticket.getUser().getUserId().equals(user.getUserId())){
            throw new ResourceNotFoundException(
                "Ticket de soporte no encontrado: " + ticketId
            );
        }

        return repository.findByTicketOrderBySentAtAsc(ticket);
    }

    // ==========================================
    // ENVIAR MENSAJE DEL USUARIO
    // ==========================================
    public SupportMessage sendMessage(Integer ticketId, SupportMessageRequestDto dto){

        Users user = getCurrentUser();

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket de soporte no encontrado: " + ticketId
                )
            );

        if (ticket.getUser() == null || !ticket.getUser().getUserId().equals(user.getUserId())){
            throw new ResourceNotFoundException(
                "Ticket de soporte no encontrado: " + ticketId
            );
        }

        if (
            ticket.getSupportTicketStatus() != null
            && "CLOSED".equals(
                ticket.getSupportTicketStatus().getCode()
            )
        ) {
            throw new IllegalStateException(
                "El ticket está cerrado y no se pueden enviar mensajes"
            );
        }

        if(dto.getMessage() == null || dto.getMessage().isBlank()){
            throw new IllegalArgumentException(
                "El mensaje no puede estar vacío"
            );
        }

        SupportMessage message = new SupportMessage();
        message.setTicket(ticket);
        message.setSenderUser(user);
        message.setSenderType(SenderType.USER);
        message.setMessage(dto.getMessage().trim());

        return repository.save(message);
    }

    // ==========================================
    // OBTENER MENSAJE (ADMIN)
    // ==========================================
    public List<SupportMessage> findAllByTicketIdForAdmin(Integer ticketId){

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket de soporte no encontrado: " + ticketId
                )
            );

        return repository.findByTicketOrderBySentAtAsc(ticket);
    }

    // ==========================================
    // ENVIAR MENSAJE (ADMIN)
    // ==========================================
    public SupportMessage sendMessageAsAgent(Integer ticketId, SupportMessageRequestDto dto){

        Users user = getCurrentUser();

        SupportTicket ticket = supportTicketRepository.findById(ticketId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Ticket de soporte no encontrado: " + ticketId
                )
            );

        validateMessage(dto);

        SupportMessage message = new SupportMessage();
        message.setTicket(ticket);
        message.setSenderUser(user);
        message.setSenderType(SenderType.AGENT);
        message.setMessage(dto.getMessage().trim());

        return repository.save(message);
    }

    // ==========================================
    // VALIDAR MENSAJE
    // ==========================================
    private void validateMessage(SupportMessageRequestDto dto) {
        if (
            dto == null
            || dto.getMessage() == null
            || dto.getMessage().isBlank()
        ) {
            throw new IllegalArgumentException(
                "El mensaje no puede estar vacío"
            );
        }
    }
    // ==========================================
    // USUARIO AUTENTICADO
    // ==========================================
    private Users getCurrentUser() {

        return (Users) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
    }

}
