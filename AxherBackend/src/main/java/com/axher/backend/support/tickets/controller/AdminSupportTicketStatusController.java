package com.axher.backend.support.tickets.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.shared.util.SortUtils;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusResponseDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.mapper.SupportTicketStatusMapper;
import com.axher.backend.support.tickets.service.SupportTicketStatusService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/support/ticket-status")
public class AdminSupportTicketStatusController {

    private final SupportTicketStatusService service;
    private final SupportTicketStatusMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "supportTicketStatusId", "code", "name", "description"
    );

    @GetMapping
    public Page<SupportTicketStatusResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "supportTicketStatusId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "supportTicketStatusId");
        Page<SupportTicketStatus> supportTicketStatusPage = service.findAll(PageRequest.of(page, size, sortObj), search);
        return supportTicketStatusPage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicketStatusResponseDto> findById(@PathVariable Integer id){
        SupportTicketStatus supportTicketStatus = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(supportTicketStatus));    
    }

    @PostMapping
    public ResponseEntity<SupportTicketStatusResponseDto> create(
        @RequestBody SupportTicketStatusRequestDto dto
    ){
        SupportTicketStatus createdSupportTicketStatus = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdSupportTicketStatus));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SupportTicketStatusResponseDto> update(
        @PathVariable Integer id,
        @RequestBody SupportTicketStatusRequestDto dto
    ){
        SupportTicketStatus updatedSupportTicketStatus = service.update(id, dto);
        return ResponseEntity.ok(mapper.toDto(updatedSupportTicketStatus));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
