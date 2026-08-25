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

import com.axher.backend.support.reports.DTOS.ReportCategoryTranslationDto;
import com.axher.backend.support.reports.DTOS.ReportCategoryTranslationRequestDto;
import com.axher.backend.support.reports.entities.ReportCategoryTranslation;
import com.axher.backend.support.reports.mapper.ReportCategoryTranslationMapper;
import com.axher.backend.support.reports.service.ReportCategoryTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/report-categories/{categoryId}/translations"
)
public class AdminReportCategoryTranslationController {

    private final ReportCategoryTranslationService service;

    private final ReportCategoryTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<ReportCategoryTranslationDto>> findAll(
            @PathVariable Integer categoryId
    ) {

        List<ReportCategoryTranslation> translations =
                service.findByCategory(categoryId);

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
    public ResponseEntity<ReportCategoryTranslationDto> save(
            @PathVariable Integer categoryId,
            @RequestBody ReportCategoryTranslationRequestDto dto
    ) {

        ReportCategoryTranslation translation =
                service.save(categoryId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ELIMINAR TRADUCCIÓN
    // =============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer categoryId,
            @PathVariable Integer languageId
    ) {

        service.delete(categoryId, languageId);

        return ResponseEntity.noContent().build();
    }
}
