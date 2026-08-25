package com.axher.backend.content.series.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EpisodeLocalizationService {

    private final EpisodeTranslationService episodeTranslationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedEpisode resolve(Episodes episode) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();


        if (languageCode == null || languageCode.isBlank()) {

            return resolveOriginal(episode);
        }


        return episodeTranslationService
                .findByEpisodeAndLanguage(
                        episode.getEpisodeId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedEpisode(
                                translation.getTitle(),
                                translation.getDescription()
                        )
                )
                .orElseGet(() ->
                        resolveOriginal(episode)
                );
    }

    private LocalizedEpisode resolveOriginal(Episodes episode) {

        String originalLanguageCode =
                episode
                    .getSeason()
                    .getSeries()
                    .getContent()
                    .getOriginalLanguage()
                    .getCode();

        return episodeTranslationService
                .findByEpisodeAndLanguage(
                        episode.getEpisodeId(),
                        originalLanguageCode
                )
                .map(translation ->
                        new LocalizedEpisode(
                                translation.getTitle(),
                                translation.getDescription()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El episodio "
                                + episode.getEpisodeId()
                                + " no tiene traducción para su idioma original"
                        )
                );
    }

    public record LocalizedEpisode(
            String title,
            String description
    ) {}
    
}
