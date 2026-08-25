package com.axher.backend.content.series.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeTranslationRequestDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.repositories.EpisodeTranslationRepository;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EpisodeTranslationService {

    private final EpisodeTranslationRepository episodeTranslationRepository;
    private final EpisodesRepository episodeRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<EpisodeTranslation> findByEpisodeAndLanguage(
            Integer episodeId,
            String languageCode
    ) {
        return episodeTranslationRepository
                .findByEpisode_EpisodeIdAndLanguage_Code(
                        episodeId,
                        languageCode
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<EpisodeTranslation> findByEpisode(
            Integer episodeId
    ) {

        if (!episodeRepository.existsById(episodeId)) {

            throw new ResourceNotFoundException(
                    "Episodio no encontrado: " + episodeId
            );
        }
        return episodeTranslationRepository
                .findByEpisode_EpisodeId(episodeId);
    }

    // ==========================================
    // CREAR O ACTUALIZAR
    // ==========================================
    public EpisodeTranslation save(
            Integer episodeId,
            EpisodeTranslationRequestDto dto
    ) {

        Episodes episode = episodeRepository.findById(episodeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Episodio no encontrado: " + episodeId
                        )
                );

        Language language = languageRepository.findById(
                dto.getLanguageId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Idioma no encontrado: "
                                + dto.getLanguageId()
                )
        );

        if (!Boolean.TRUE.equals(language.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma inactivo: "
                            + dto.getLanguageId()
            );
        }

        EpisodeTranslation translation =
                episodeTranslationRepository
                        .findByEpisode_EpisodeIdAndLanguage_LanguageId(
                                episodeId,
                                language.getLanguageId()
                        )
                        .orElseGet(EpisodeTranslation::new);

        translation.setEpisode(episode);
        translation.setLanguage(language);
        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return episodeTranslationRepository.save(
                translation
        );
    }

    // ==========================================
    // ELIMINAR
    // ==========================================
    public void delete(
            Integer episodeId,
            Integer languageId
    ) {

        if (!episodeRepository.existsById(episodeId)) {

            throw new ResourceNotFoundException(
                    "Episodio no encontrado: " + episodeId
            );
        }

        EpisodeTranslation translation =
                episodeTranslationRepository
                        .findByEpisode_EpisodeIdAndLanguage_LanguageId(
                                episodeId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        episodeTranslationRepository.delete(
                translation
        );
    }

    
}
