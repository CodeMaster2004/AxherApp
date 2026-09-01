package com.axher.backend.catalog.shelf.controllers;

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

import com.axher.backend.catalog.shelf.DTOs.ContentShelfAiTranslationRequestDto;
import com.axher.backend.catalog.shelf.DTOs.ContentShelfAiTranslationResponseDto;
import com.axher.backend.catalog.shelf.DTOs.ContentShelfTranslationDto;
import com.axher.backend.catalog.shelf.DTOs.ContentShelfTranslationRequestDto;
import com.axher.backend.catalog.shelf.entities.ContentShelfTranslation;
import com.axher.backend.catalog.shelf.mapper.ContentShelfTranslationMapper;
import com.axher.backend.catalog.shelf.service.ContentShelfTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/content-shelves/{shelfId}/translations"
)
public class AdminContentShelfTranslationController {

    private final ContentShelfTranslationService service;

    private final ContentShelfTranslationMapper mapper;


    // =============================
    // LISTAR TRADUCCIONES
    // =============================

    @GetMapping
    public ResponseEntity<List<ContentShelfTranslationDto>> findAll(
            @PathVariable Integer shelfId
    ) {

        List<ContentShelfTranslation> translations =
                service.findByShelf(shelfId);

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
    public ResponseEntity<ContentShelfTranslationDto> create(
            @PathVariable Integer shelfId,
            @RequestBody ContentShelfTranslationRequestDto dto
    ) {

        ContentShelfTranslation translation =
                service.create(shelfId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<ContentShelfTranslationDto> update(
            @PathVariable Integer shelfId,
            @PathVariable Integer languageId,
            @RequestBody ContentShelfTranslationRequestDto dto
    ) {

        ContentShelfTranslation translation =
                service.update(
                        shelfId,
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
    public ResponseEntity<ContentShelfAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer shelfId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody ContentShelfAiTranslationRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.translateWithAi(
                        shelfId,
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
            @PathVariable Integer shelfId,
            @PathVariable Integer languageId
    ) {

        service.delete(
                shelfId,
                languageId
        );

        return ResponseEntity.noContent().build();
    }
}