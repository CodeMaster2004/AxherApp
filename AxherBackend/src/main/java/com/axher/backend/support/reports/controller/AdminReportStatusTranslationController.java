package com.axher.backend.support.reports.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.reports.DTOS.ReportStatusAiTranslationRequestDto;
import com.axher.backend.support.reports.DTOS.ReportStatusAiTranslationResponseDto;
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
    // CREAR TRADUCCIÓN
    // =============================
    @PostMapping
    public ResponseEntity<ReportStatusTranslationDto> create(
            @PathVariable Integer statusId,
            @RequestBody ReportStatusTranslationRequestDto dto
    ) {

        ReportStatusTranslation translation =
                service.create(statusId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<ReportStatusTranslationDto> update(
            @PathVariable Integer statusId,
            @PathVariable Integer languageId,
            @RequestBody ReportStatusTranslationRequestDto dto
    ) {

        ReportStatusTranslation translation =
                service.update(statusId, languageId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // TRADUCIR CON AI
    // =============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<ReportStatusAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer statusId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody ReportStatusAiTranslationRequestDto dto
    ){
            return ResponseEntity.ok(
                    service.translateWithAi(
                            statusId,
                            sourceLanguageId,
                            dto
                    )
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
