package com.axher.backend.support.tickets.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.tickets.DTOs.SupportMessageRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportMessageResponseDto;
import com.axher.backend.support.tickets.entities.SupportMessage;
import com.axher.backend.support.tickets.mapper.SupportMessageMapper;
import com.axher.backend.support.tickets.service.SupportMessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/support/tickets/{ticketId}/messages")
public class SupportMessageController {

    private final SupportMessageService service;
    private final SupportMessageMapper mapper;

    // ==========================================
    // LISTAR MENSAJES DE MI TICKET
    // ==========================================
    @GetMapping
    public ResponseEntity<List<SupportMessageResponseDto>> findAll(
        @PathVariable Integer ticketId
    ){
        List<SupportMessage> messages = service.findAllByTicketId(ticketId);
        return ResponseEntity.ok(messages.stream().map(mapper::toDto).toList());
    }

    // ==========================================
    // EVIAR MENSAJE
    // ==========================================
    @PostMapping
    public ResponseEntity<SupportMessageResponseDto> sendMessage(
        @PathVariable Integer ticketId,
        @RequestBody SupportMessageRequestDto dto
    ){
        SupportMessage message = service.sendMessage(ticketId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(message));
    }
    
}
