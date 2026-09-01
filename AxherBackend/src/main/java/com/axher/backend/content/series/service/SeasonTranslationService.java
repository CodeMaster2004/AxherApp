package com.axher.backend.content.series.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonAiTranslationRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonAiTranslationResponseDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonTranslationRequestDto;
import com.axher.backend.content.series.entities.SeasonTranslation;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.repositories.SeasonTranslationRepository;
import com.axher.backend.content.series.repositories.SeasonsRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonTranslationService {

    private final SeasonTranslationRepository seasonTranslationRepository;
    private final SeasonsRepository seasonRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<SeasonTranslation> findBySeasonAndLanguage(
            Integer seasonId,
            String languageCode
    ) {
        return seasonTranslationRepository
                .findBySeason_SeasonIdAndLanguage_Code(
                        seasonId,
                        languageCode
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<SeasonTranslation> findBySeason(
            Integer seasonId
    ) {

        if (!seasonRepository.existsById(seasonId)) {

            throw new ResourceNotFoundException(
                    "Temporada no encontrada: " + seasonId
            );
        }

        return seasonTranslationRepository
                .findBySeason_SeasonId(seasonId);
    }

    // ==========================================
    // CREAR TRADUCCIÓN
    // ==========================================
    public SeasonTranslation create(
            Integer seasonId,
            SeasonTranslationRequestDto dto
    ) {
        Seasons season = seasonRepository.findById(seasonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Temporada no encontrada: " + seasonId
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
                seasonTranslationRepository
                        .existsBySeason_SeasonIdAndLanguage_LanguageId(
                                seasonId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        SeasonTranslation translation =
                new SeasonTranslation();

        translation.setSeason(season);
        translation.setLanguage(language);
        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return seasonTranslationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public SeasonTranslation update(
            Integer seasonId,
            Integer languageId,
            SeasonTranslationRequestDto dto
    ) {
        SeasonTranslation translation =
                seasonTranslationRepository
                        .findBySeason_SeasonIdAndLanguage_LanguageId(
                                seasonId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return seasonTranslationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================

    public SeasonAiTranslationResponseDto translateWithAi(
            Integer seasonId,
            Integer sourceLanguageId,
            SeasonAiTranslationRequestDto dto

    ) {

        seasonRepository.findById(seasonId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Temporada no encontrada: " + seasonId
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

        SeasonTranslation sourceTranslation =
                seasonTranslationRepository
                        .findBySeason_SeasonIdAndLanguage_LanguageId(
                                seasonId,
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

        SeasonAiTranslationResponseDto response =
                new SeasonAiTranslationResponseDto();

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
    // ELIMINAR UNA TRADUCCIÓN
    // ==========================================
    public void delete(
            Integer seasonId,
            Integer languageId
    ) {

        if (!seasonRepository.existsById(seasonId)) {

            throw new ResourceNotFoundException(
                    "Temporada no encontrada: " + seasonId
            );
        }

        SeasonTranslation translation =
                seasonTranslationRepository
                        .findBySeason_SeasonIdAndLanguage_LanguageId(
                                seasonId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        seasonTranslationRepository.delete(
                translation
        );
    }
    
}
