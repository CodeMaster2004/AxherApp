package com.axher.backend.content.series.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonTranslationRequestDto;
import com.axher.backend.content.series.entities.SeasonTranslation;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.repositories.SeasonTranslationRepository;
import com.axher.backend.content.series.repositories.SeasonsRepository;
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
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public SeasonTranslation save(
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

        SeasonTranslation translation =
                seasonTranslationRepository
                        .findBySeason_SeasonIdAndLanguage_LanguageId(
                                seasonId,
                                language.getLanguageId()
                        )
                        .orElseGet(SeasonTranslation::new);

        translation.setSeason(season);
        translation.setLanguage(language);
        translation.setTitle(dto.getTitle());
        translation.setDescription(dto.getDescription());

        return seasonTranslationRepository.save(
                translation
        );
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
