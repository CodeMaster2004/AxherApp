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

import com.axher.backend.content.core.DTOs.ContentCategoryTranslationDto;
import com.axher.backend.content.core.DTOs.ContentCategoryTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentCategoryTranslation;
import com.axher.backend.content.core.mapper.ContentCategoryTranslationMapper;
import com.axher.backend.content.core.service.ContentCategoryTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/content-categories/{categoryId}/translations"
)
public class AdminContentCategoryTranslationController {

    private final ContentCategoryTranslationService service;
    private final ContentCategoryTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================

    @GetMapping
    public ResponseEntity<List<ContentCategoryTranslationDto>> findAll(
            @PathVariable Integer categoryId
    ) {

        List<ContentCategoryTranslation> translations =
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
    public ResponseEntity<ContentCategoryTranslationDto> save(
            @PathVariable Integer categoryId,
            @RequestBody ContentCategoryTranslationRequestDto dto
    ) {

        ContentCategoryTranslation translation =
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