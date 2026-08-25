package com.axher.backend.support.tickets.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.tickets.DTOs.SupportTicketStatusTranslationDto;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusTranslationRequestDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatusTranslation;
import com.axher.backend.support.tickets.mapper.SupportTicketStatusTranslationMapper;
import com.axher.backend.support.tickets.service.SupportTicketStatusTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/support-ticket-statuses/{statusId}/translations"
)
public class AdminSupportTicketStatusTranslationController {

    private final SupportTicketStatusTranslationService service;

    private final SupportTicketStatusTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<SupportTicketStatusTranslationDto>> findAll(
            @PathVariable Integer statusId
    ) {

        List<SupportTicketStatusTranslation> translations =
                service.findByStatus(statusId);

        return ResponseEntity.ok(
                translations.stream()
                        .map(mapper::toDto)
                        .toList()
        );
    }

    // =============================
    // CREAR / ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping
    public ResponseEntity<SupportTicketStatusTranslationDto> save(
            @PathVariable Integer statusId,
            @RequestBody SupportTicketStatusTranslationRequestDto dto
    ) {

        SupportTicketStatusTranslation translation =
                service.save(statusId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ELIMINAR TRADUCCIÓN
    // =============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer statusId,
            @PathVariable Integer languageId
    ) {

        service.delete(statusId, languageId);

        return ResponseEntity.noContent().build();
    }
}