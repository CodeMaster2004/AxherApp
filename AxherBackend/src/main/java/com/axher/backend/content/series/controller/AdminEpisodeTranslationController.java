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

import com.axher.backend.content.core.mapper.EpisodeTranslationMapper;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeAiTranslationRequestDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeAiTranslationResponseDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeTranslationDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeTranslationRequestDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;
import com.axher.backend.content.series.service.EpisodeTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/episodes/{episodeId}/translations")
public class AdminEpisodeTranslationController {

    private final EpisodeTranslationService service;
    private final EpisodeTranslationMapper mapper;

    //=============================
    // LISTAR TRADUCCIONES
    //=============================
    @GetMapping
    public ResponseEntity<List<EpisodeTranslationDto>> findAll(
            @PathVariable Integer episodeId
    ) {

        List<EpisodeTranslation> translations =
                service.findByEpisode(episodeId);

        return ResponseEntity.ok(
            translations.stream()
                .map(mapper::toDto)
                .toList()
        );
    }

    //=============================
    // CREAR TRADUCCIÓN
    //=============================
    @PostMapping
    public ResponseEntity<EpisodeTranslationDto> create(
            @PathVariable Integer episodeId,
            @RequestBody EpisodeTranslationRequestDto dto
    ) {

        EpisodeTranslation translation =
                service.create(episodeId, dto);

        return ResponseEntity.ok(
            mapper.toDto(translation)
        );
    }

    //=============================
    // ACTUALIZAR TRADUCCIÓN
    //=============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<EpisodeTranslationDto> update(
        @PathVariable Integer episodeId,
        @PathVariable Integer languageId,
        @RequestBody EpisodeTranslationRequestDto dto
    ){
        EpisodeTranslation translation =
            service.update(episodeId, languageId, dto);

        return ResponseEntity.ok(
            mapper.toDto(translation)
        );
    }

    //=============================
    // TRADUCIR CON AI
    //=============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<EpisodeAiTranslationResponseDto> translateWithAi(
        @PathVariable Integer episodeId,
        @PathVariable Integer sourceLanguageId,
        @RequestBody EpisodeAiTranslationRequestDto dto
    ){
        return ResponseEntity.ok(
                service.translateWithAi(
                        episodeId,
                        sourceLanguageId,
                        dto
                )
        );
    }

    //============================
    // ELIMINAR TRADUCCIÓN
    //============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer episodeId,
            @PathVariable Integer languageId
    ) {

        service.delete(episodeId, languageId);

        return ResponseEntity.noContent().build();
    }
    
}
