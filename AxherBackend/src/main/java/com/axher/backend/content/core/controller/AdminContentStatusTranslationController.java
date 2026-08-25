package com.axher.backend.content.core.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.ContentStatusTranslationDto;
import com.axher.backend.content.core.DTOs.ContentStatusTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentStatusTranslation;
import com.axher.backend.content.core.mapper.ContentStatusTranslationMapper;
import com.axher.backend.content.core.service.ContentStatusTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/content-statuses/{statusId}/translations"
)
public class AdminContentStatusTranslationController {

    private final ContentStatusTranslationService service;
    private final ContentStatusTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<ContentStatusTranslationDto>> findAll(
            @PathVariable Integer statusId
    ) {

        List<ContentStatusTranslation> translations =
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
    public ResponseEntity<ContentStatusTranslationDto> save(
            @PathVariable Integer statusId,
            @RequestBody ContentStatusTranslationRequestDto dto
    ) {

        ContentStatusTranslation translation =
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