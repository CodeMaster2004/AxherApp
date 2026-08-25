package com.axher.backend.content.series.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonLocalizationService {
    
    private final SeasonTranslationService seasonTranslationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedSeason resolve(Seasons season) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();


        if (languageCode == null || languageCode.isBlank()) {

            return resolveOriginal(season);
        }


        return seasonTranslationService
                .findBySeasonAndLanguage(
                        season.getSeasonId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedSeason(
                                translation.getTitle(),
                                translation.getDescription()
                        )
                )
                .orElseGet(() ->
                        resolveOriginal(season)
                );
    }

    private LocalizedSeason resolveOriginal(Seasons season) {

        String originalLanguageCode =
                season
                    .getSeries()
                    .getContent()
                    .getOriginalLanguage()
                    .getCode();

        return seasonTranslationService
                .findBySeasonAndLanguage(
                        season.getSeasonId(),
                        originalLanguageCode
                )
                .map(translation ->
                        new LocalizedSeason(
                                translation.getTitle(),
                                translation.getDescription()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "La temporada "
                                + season.getSeasonId()
                                + " no tiene traducción para su idioma original"
                        )
                );
    }

    public record LocalizedSeason(
            String title,
            String description
    ) {}

}
