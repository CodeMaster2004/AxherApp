package com.axher.backend.content.series.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeTranslationDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;
import com.axher.backend.content.series.service.EpisodeTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/episodes")
public class EpisodeTranslationController {

    private final EpisodeTranslationService episodeTranslationService;

    @GetMapping("/{episodeId}/translations/{languageCode}")
    public ResponseEntity<EpisodeTranslationDto> findTranslation(
            @PathVariable Integer episodeId,
            @PathVariable String languageCode
    ) {

        EpisodeTranslation translation =
                episodeTranslationService
                        .findByEpisodeAndLanguage(
                                episodeId,
                                languageCode
                        )
                        .orElse(null);

        if (translation == null) {
            return ResponseEntity.notFound().build();
        }

        EpisodeTranslationDto dto = new EpisodeTranslationDto(
                translation.getEpisode().getEpisodeId(),
                translation.getLanguage().getLanguageId(),
                translation.getLanguage().getCode(),
                translation.getLanguage().getName(),
                translation.getTitle(),
                translation.getDescription()
        );

        return ResponseEntity.ok(dto);
    }
    
}
