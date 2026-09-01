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

import com.axher.backend.content.core.DTOs.ContentAiTranslationRequestDto;
import com.axher.backend.content.core.DTOs.ContentAiTranslationResponseDto;
import com.axher.backend.content.core.DTOs.ContentTranslationDto;
import com.axher.backend.content.core.DTOs.ContentTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentTranslation;
import com.axher.backend.content.core.mapper.ContentTranslationMapper;
import com.axher.backend.content.core.service.ContentTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/contents/{contentId}/translations")
public class AdminContentTranslationController {

    private final ContentTranslationService service;
    private final ContentTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<ContentTranslationDto>> findAll(
        @PathVariable Integer contentId
    ){
        List<ContentTranslation> translations = service.findByContent(contentId);

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
    public ResponseEntity<ContentTranslationDto> create(
        @PathVariable Integer contentId,
        @RequestBody ContentTranslationRequestDto dto
    ){
        ContentTranslation translation = service.create(contentId, dto);

        return ResponseEntity.ok(mapper.toDto(translation));
    }

    // ============================
    // ACTUALIZAR TRADUCCIÓN
    // ============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<ContentTranslationDto> update(
            @PathVariable Integer contentId,
            @PathVariable Integer languageId,
            @RequestBody ContentTranslationRequestDto dto
    ) {

        ContentTranslation translation =
                service.update(
                        contentId,
                        languageId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // ============================
    // TRADUCIR CON AI
    // ============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<ContentAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer contentId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody ContentAiTranslationRequestDto dto
    ){
        return ResponseEntity.ok(
                service.translateWithAi(
                        contentId,
                        sourceLanguageId,
                        dto
                )
        );
    }
    // ============================
    // ELIMINAR TRADUCCIÓN
    // ============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer contentId,
        @PathVariable Integer languageId
    ){
        service.delete(contentId, languageId);

        return ResponseEntity.noContent().build();
    }
    
    
}
