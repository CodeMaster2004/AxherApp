package com.axher.backend.content.core.controller;

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

import com.axher.backend.content.core.DTOs.ContentStatusAiTranslationRequestDto;
import com.axher.backend.content.core.DTOs.ContentStatusAiTranslationResponseDto;
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
    // CREAR TRADUCCIÓN
    // =============================
    @PostMapping
    public ResponseEntity<ContentStatusTranslationDto> create(
            @PathVariable Integer statusId,
            @RequestBody ContentStatusTranslationRequestDto dto
    ) {

        ContentStatusTranslation translation =
                service.create(statusId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<ContentStatusTranslationDto> update(
            @PathVariable Integer statusId,
            @PathVariable Integer languageId,
            @RequestBody ContentStatusTranslationRequestDto dto
    ) {

        ContentStatusTranslation translation =
                service.update(
                        statusId,
                        languageId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // TRADUCIR CON AI
    // =============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<ContentStatusAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer statusId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody ContentStatusAiTranslationRequestDto dto
    ) {
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