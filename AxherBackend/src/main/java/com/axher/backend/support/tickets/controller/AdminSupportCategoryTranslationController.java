package com.axher.backend.support.tickets.controller;

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

import com.axher.backend.support.tickets.DTOs.SupportCategoryAiTranslationRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportCategoryAiTranslationResponseDto;
import com.axher.backend.support.tickets.DTOs.SupportCategoryTranslationDto;
import com.axher.backend.support.tickets.DTOs.SupportCategoryTranslationRequestDto;
import com.axher.backend.support.tickets.entities.SupportCategoryTranslation;
import com.axher.backend.support.tickets.mapper.SupportCategoryTranslationMapper;
import com.axher.backend.support.tickets.service.SupportCategoryTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/support-categories/{categoryId}/translations"
)
public class AdminSupportCategoryTranslationController {

    private final SupportCategoryTranslationService service;

    private final SupportCategoryTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<SupportCategoryTranslationDto>> findAll(
            @PathVariable Integer categoryId
    ) {

        List<SupportCategoryTranslation> translations =
                service.findByCategory(categoryId);

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
    public ResponseEntity<SupportCategoryTranslationDto> create(
            @PathVariable Integer categoryId,
            @RequestBody SupportCategoryTranslationRequestDto dto
    ) {

        SupportCategoryTranslation translation =
                service.create(categoryId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    //============================
    // ACTUALIZAR TRADUCCIÓN
    // ===========================
    @PatchMapping("/{languageId}")
    public ResponseEntity<SupportCategoryTranslationDto> update(
        @PathVariable Integer categoryId,
        @PathVariable Integer languageId,
        @RequestBody SupportCategoryTranslationRequestDto dto
    ){
        SupportCategoryTranslation translation =
                service.update(categoryId, languageId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // ============================
    // TRADUCIR CON AI
    // ============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<SupportCategoryAiTranslationResponseDto> translateWithAi(
        @PathVariable Integer categoryId,
        @PathVariable Integer sourceLanguageId,
        @RequestBody SupportCategoryAiTranslationRequestDto dto
    ){
        return ResponseEntity.ok(
                service.translateWithAi(
                        categoryId,
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
            @PathVariable Integer categoryId,
            @PathVariable Integer languageId
    ) {

        service.delete(categoryId, languageId);

        return ResponseEntity.noContent().build();
    }
}
