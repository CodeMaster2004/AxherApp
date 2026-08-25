package com.axher.backend.content.series.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.mapper.SeasonTranslationMapper;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonTranslationDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonTranslationRequestDto;
import com.axher.backend.content.series.entities.SeasonTranslation;
import com.axher.backend.content.series.service.SeasonTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/seasons/{seasonId}/translations")
public class AdminSeasonTranslationController {

    private final SeasonTranslationService service;
    private final SeasonTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<SeasonTranslationDto>> findAll(
            @PathVariable Integer seasonId
    ) {

        List<SeasonTranslation> translations =
                service.findBySeason(seasonId);

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
    public ResponseEntity<SeasonTranslationDto> save(
            @PathVariable Integer seasonId,
            @RequestBody SeasonTranslationRequestDto dto
    ) {

        SeasonTranslation translation =
                service.save(seasonId, dto);

        return ResponseEntity.ok(
            mapper.toDto(translation)
        );
    }

    // ============================
    // ELIMINAR TRADUCCIÓN
    // ============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer seasonId,
            @PathVariable Integer languageId
    ) {

        service.delete(seasonId, languageId);

        return ResponseEntity.noContent().build();
    }

    
    
}
