package com.axher.backend.support.tickets.controller;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.shared.util.SortUtils;
import com.axher.backend.support.tickets.DTOs.SupportTicketResponseDto;
import com.axher.backend.support.tickets.DTOs.TicketStatusRequestDto;
import com.axher.backend.support.tickets.entities.SupportTicket;
import com.axher.backend.support.tickets.mapper.SupportTicketMapper;
import com.axher.backend.support.tickets.service.SupportTicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/support/tickets")
public class AdminSupportTicketController {

    private final SupportTicketService service;
    private final SupportTicketMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "supportTicketId",
        "subject",
        "createdAt",
        "updatedAt",
        "resolvedAt",
        "closedAt"
    );

    // ==========================================
    // LISTAR TICKETS DE SOPORTE
    // ==========================================
    @GetMapping
    public Page<SupportTicketResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "createdAt,desc") String sort,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String statusCode,
        @RequestParam(required = false) Integer supportCategoryId,
        @RequestParam(required = false) Integer userId,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtFrom,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime createdAtTo
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "createdAt");
        Page<SupportTicket> supportTicketsPage = service.findAllForAdmin(
            PageRequest.of(page, size, sortObj),
            search,
            statusCode,
            supportCategoryId,
            userId,
            createdAtFrom,
            createdAtTo
        );
        return supportTicketsPage.map(mapper::toDto);
    }

    // ==========================================
    // OBTENER TICKET
    // ==========================================
    @GetMapping("/{ticketId}")
    public ResponseEntity<SupportTicketResponseDto> findById(
        @PathVariable Integer id
    ){
        SupportTicket ticket = service.findByIdForAdmin(id);
        return ResponseEntity.ok(mapper.toDto(ticket));
    }

    // ==========================================
    // ACTUALIZAR ESTADO DEL TICKET
    // ==========================================
    @PatchMapping("/{ticketId}/status")
    public ResponseEntity<SupportTicketResponseDto> updateStatus(
        @PathVariable Integer ticketId,
        @RequestBody TicketStatusRequestDto dto
    ){
        SupportTicket updatedTicket = service.updateStatus(ticketId, dto);
        return ResponseEntity.ok(mapper.toDto(updatedTicket));
    }
    
    
    
}
