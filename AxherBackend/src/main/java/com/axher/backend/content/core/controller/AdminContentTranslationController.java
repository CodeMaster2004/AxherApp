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
    // CREAR/ ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping
    public ResponseEntity<ContentTranslationDto> save(
        @PathVariable Integer contentId,
        @RequestBody ContentTranslationRequestDto dto
    ){
        ContentTranslation translation = service.save(contentId, dto);

        return ResponseEntity.ok(mapper.toDto(translation));
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
