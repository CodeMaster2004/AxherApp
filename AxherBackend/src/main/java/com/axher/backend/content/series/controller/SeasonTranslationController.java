package com.axher.backend.content.series.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonTranslationDto;
import com.axher.backend.content.series.entities.SeasonTranslation;
import com.axher.backend.content.series.service.SeasonTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seasons")
public class SeasonTranslationController {

    private final SeasonTranslationService seasonTranslationService;

    @GetMapping("/{seasonId}/translations/{languageCode}")
    public ResponseEntity<SeasonTranslationDto> findTranslation(
            @PathVariable Integer seasonId,
            @PathVariable String languageCode
    ) {

        SeasonTranslation translation =
                seasonTranslationService
                        .findBySeasonAndLanguage(
                                seasonId,
                                languageCode
                        )
                        .orElse(null);

        if (translation == null) {
            return ResponseEntity.notFound().build();
        }

        SeasonTranslationDto dto = new SeasonTranslationDto(
                translation.getSeason().getSeasonId(),
                translation.getLanguage().getLanguageId(),
                translation.getLanguage().getCode(),
                translation.getLanguage().getName(),
                translation.getTitle(),
                translation.getDescription()
        );

        return ResponseEntity.ok(dto);
    }
    
}
