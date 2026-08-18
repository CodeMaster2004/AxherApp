package com.axher.backend.support.tickets.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.tickets.DTOs.SupportTicketRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportTicketResponseDto;
import com.axher.backend.support.tickets.entities.SupportTicket;
import com.axher.backend.support.tickets.mapper.SupportTicketMapper;
import com.axher.backend.support.tickets.service.SupportTicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/support/tickets")
public class SupportTicketController {

    private final SupportTicketService service;
    private final SupportTicketMapper mapper;

    // ==========================================
    // LISTAR MIS TICKETS
    // ==========================================
    @GetMapping
    public Page<SupportTicketResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<SupportTicket> tickets = service.findAll(pageable);
        return tickets.map(mapper::toDto);
    }

    // ==========================================
    // OBTENER MI TICKET
    // ==========================================
    @GetMapping("/{ticketId}")
    public ResponseEntity<SupportTicketResponseDto> findById(@PathVariable Integer ticketId){
        SupportTicket ticket = service.findById(ticketId);
        return ResponseEntity.ok(mapper.toDto(ticket));
    }

    // ==========================================
    // CREAR TICKET
    // ==========================================
    @PostMapping
    public ResponseEntity<SupportTicketResponseDto> create(
        @RequestBody SupportTicketRequestDto dto
    ){
        SupportTicket ticket = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(ticket));
    }


    
}
