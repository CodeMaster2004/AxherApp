package com.axher.backend.content.series.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeAiTranslationRequestDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeAiTranslationResponseDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeTranslationRequestDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.repositories.EpisodeTranslationRepository;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
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
    private final AiTranslationService aiTranslationService;

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
    // CREAR TRADUCCIÓN
    // ==========================================
    public EpisodeTranslation create(
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
                        "Idioma no encontrado: " + dto.getLanguageId()
                )
        );

        if (!Boolean.TRUE.equals(language.getActive())) {
            throw new IllegalArgumentException(
                    "Idioma inactivo: " + language.getCode()
            );
        }

        boolean exists =
                episodeTranslationRepository
                        .existsByEpisode_EpisodeIdAndLanguage_LanguageId(
                                episodeId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        EpisodeTranslation translation =
                new EpisodeTranslation();

        translation.setEpisode(episode);
        translation.setLanguage(language);
        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return episodeTranslationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public EpisodeTranslation update(
            Integer episodeId,
            Integer languageId,
            EpisodeTranslationRequestDto dto
    ) {
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

        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return episodeTranslationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================
    public EpisodeAiTranslationResponseDto translateWithAi(
            Integer episodeId,
            Integer sourceLanguageId,
            EpisodeAiTranslationRequestDto dto

    ) {

        episodeRepository.findById(episodeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Episodio no encontrado: " + episodeId
                        )
                );

        Language sourceLanguage =
                languageRepository.findById(sourceLanguageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma origen no encontrado: "
                                                + sourceLanguageId
                                )
                        );

        Language targetLanguage =
                languageRepository.findById(dto.getTargetLanguageId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma de destino no encontrado: "
                                                + dto.getTargetLanguageId()
                                )
                        );

        if (!Boolean.TRUE.equals(sourceLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma origen está inactivo: "
                            + sourceLanguage.getCode()
            );
        }

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma destino está inactivo: "
                            + targetLanguage.getCode()
            );
        }

        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

            throw new IllegalArgumentException(
                    "El idioma origen y destino no pueden ser iguales"
            );
        }

        EpisodeTranslation sourceTranslation =
                episodeTranslationRepository
                        .findByEpisode_EpisodeIdAndLanguage_LanguageId(
                                episodeId,
                                sourceLanguageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción en el idioma origen"
                                )
                        );

        AiTranslationRequest request =
                new AiTranslationRequest(
                        sourceLanguage.getCode(),
                        targetLanguage.getCode(),
                        Map.of(
                                "title",
                                sourceTranslation.getTitle(),

                                "description",
                                sourceTranslation.getDescription()
                        )
                );

        AiTranslationResult result =
                aiTranslationService.translate(request);

        EpisodeAiTranslationResponseDto response =
                new EpisodeAiTranslationResponseDto();

        response.setSourceLanguageId(sourceLanguageId);

        response.setTargetLanguageId(
                targetLanguage.getLanguageId()
        );

        response.setSourceTitle(
                sourceTranslation.getTitle()
        );

        response.setSourceDescription(
                sourceTranslation.getDescription()
        );

        response.setTranslatedTitle(
                result.fields().get("title")
        );

        response.setTranslatedDescription(
                result.fields().get("description")
        );

        return response;
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
