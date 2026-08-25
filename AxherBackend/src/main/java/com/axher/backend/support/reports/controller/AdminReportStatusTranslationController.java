package com.axher.backend.support.reports.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.reports.DTOS.ReportStatusTranslationDto;
import com.axher.backend.support.reports.DTOS.ReportStatusTranslationRequestDto;
import com.axher.backend.support.reports.entities.ReportStatusTranslation;
import com.axher.backend.support.reports.mapper.ReportStatusTranslationMapper;
import com.axher.backend.support.reports.service.ReportStatusTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/report-statuses/{statusId}/translations"
)
public class AdminReportStatusTranslationController {

    private final ReportStatusTranslationService service;
    private final ReportStatusTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<ReportStatusTranslationDto>> findAll(
            @PathVariable Integer statusId
    ) {

        List<ReportStatusTranslation> translations =
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
    public ResponseEntity<ReportStatusTranslationDto> save(
            @PathVariable Integer statusId,
            @RequestBody ReportStatusTranslationRequestDto dto
    ) {

        ReportStatusTranslation translation =
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
