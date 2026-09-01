package com.axher.backend.content.series.controller;

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

import com.axher.backend.content.core.mapper.SeasonTranslationMapper;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonAiTranslationRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonAiTranslationResponseDto;
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
    // CREAR TRADUCCIÓN
    // =============================
    @PostMapping
    public ResponseEntity<SeasonTranslationDto> create(
            @PathVariable Integer seasonId,
            @RequestBody SeasonTranslationRequestDto dto
    ) {

        SeasonTranslation translation =
                service.create(seasonId, dto);

        return ResponseEntity.ok(
            mapper.toDto(translation)
        );
    }

    // ============================
    // ACTUALIZAR TRADUCCIÓN
    // ============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<SeasonTranslationDto> update(
            @PathVariable Integer seasonId,
            @PathVariable Integer languageId,
            @RequestBody SeasonTranslationRequestDto dto
    ) {
        SeasonTranslation translation =
                service.update(seasonId, languageId, dto);

        return ResponseEntity.ok(
            mapper.toDto(translation)
        );
    }

    // ============================
    // TRADUCIR CON AI
    // ============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<SeasonAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer seasonId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody SeasonAiTranslationRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.translateWithAi(
                        seasonId,
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
            @PathVariable Integer seasonId,
            @PathVariable Integer languageId
    ) {

        service.delete(seasonId, languageId);

        return ResponseEntity.noContent().build();
    }

    
    
}
