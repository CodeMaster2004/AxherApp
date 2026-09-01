package com.axher.backend.catalog.banner.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.banner.DTOs.HeroBannerAiTranslationRequestDto;
import com.axher.backend.catalog.banner.DTOs.HeroBannerAiTranslationResponseDto;
import com.axher.backend.catalog.banner.DTOs.HeroBannerTranslationRequestDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.entities.HeroBannerTranslation;
import com.axher.backend.catalog.banner.repositories.HeroBannerRepository;
import com.axher.backend.catalog.banner.repositories.HeroBannerTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeroBannerTranslationService {

    private final HeroBannerTranslationRepository translationRepository;
    private final HeroBannerRepository bannerRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<HeroBannerTranslation> findByBannerAndLanguage(
            Integer bannerId,
            String languageCode
    ) {
        return translationRepository
                .findByHeroBanner_HeroBannerIdAndLanguage_Code(
                        bannerId,
                        languageCode
                );
    }

    public Optional<HeroBannerTranslation> findFirstAvailable(
            Integer bannerId
    ) {
        return translationRepository
                .findFirstByHeroBanner_HeroBannerId(bannerId);
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================

    public List<HeroBannerTranslation> findByBanner(
            Integer bannerId
    ) {
        if (!bannerRepository.existsById(bannerId)) {
            throw new ResourceNotFoundException(
                    "Banner no encontrado: " + bannerId
            );
        }

        return translationRepository
                .findByHeroBanner_HeroBannerId(bannerId);
    }

    // ==========================================
    // CREAR TRADUCCIÓN
    // ==========================================
    public HeroBannerTranslation create(
            Integer bannerId,
            HeroBannerTranslationRequestDto dto
    ) {

        HeroBanner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Banner no encontrado: " + bannerId
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
                    "Idioma inactivo: " + language.getCode()
            );
        }

        boolean exists =
                translationRepository
                        .existsByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
                                bannerId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        HeroBannerTranslation translation =
                new HeroBannerTranslation();

        translation.setHeroBanner(banner);
        translation.setLanguage(language);
        translation.setTitleOverride(
                dto.getTitleOverride()
        );
        translation.setDescriptionOverride(
                dto.getDescriptionOverride()
        );

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public HeroBannerTranslation update(
            Integer bannerId,
            Integer languageId,
            HeroBannerTranslationRequestDto dto
    ) {

        HeroBannerTranslation translation =
                translationRepository
                        .findByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
                                bannerId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translation.setTitleOverride(
                dto.getTitleOverride()
        );

        translation.setDescriptionOverride(
                dto.getDescriptionOverride()
        );

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================
    public HeroBannerAiTranslationResponseDto translateWithAi(
            Integer bannerId,
            Integer sourceLanguageId,
            HeroBannerAiTranslationRequestDto dto
    ) {

        // ==========================================
        // VALIDAR BANNER
        // ==========================================

        bannerRepository.findById(bannerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Banner no encontrado: " + bannerId
                        )
                );


        // ==========================================
        // VALIDAR IDIOMA ORIGEN
        // ==========================================

        Language sourceLanguage =
                languageRepository.findById(sourceLanguageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma origen no encontrado: "
                                                + sourceLanguageId
                                )
                        );


        // ==========================================
        // VALIDAR IDIOMA DESTINO
        // ==========================================

        Language targetLanguage =
                languageRepository.findById(
                        dto.getTargetLanguageId()
                )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma de destino no encontrado: "
                                                + dto.getTargetLanguageId()
                                )
                        );


        // ==========================================
        // VALIDAR IDIOMA ORIGEN ACTIVO
        // ==========================================

        if (!Boolean.TRUE.equals(sourceLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma origen esta inactivo: "
                            + sourceLanguage.getCode()
            );
        }


        // ==========================================
        // VALIDAR IDIOMA DESTINO ACTIVO
        // ==========================================

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma destino esta inactivo: "
                            + targetLanguage.getCode()
            );
        }


        // ==========================================
        // VALIDAR IDIOMAS DIFERENTES
        // ==========================================

        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

            throw new IllegalArgumentException(
                    "El idioma origen y destino no pueden ser iguales"
            );
        }


        // ==========================================
        // OBTENER TRADUCCIÓN ORIGEN
        // ==========================================

        HeroBannerTranslation sourceTranslation =
                translationRepository
                        .findByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
                                bannerId,
                                sourceLanguageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción en el idioma origen"
                                )
                        );


        // ==========================================
        // PREPARAR SOLICITUD PARA AI
        // ==========================================

        AiTranslationRequest request =
                new AiTranslationRequest(
                        sourceLanguage.getCode(),
                        targetLanguage.getCode(),
                        Map.of(
                                "titleOverride",
                                sourceTranslation.getTitleOverride(),

                                "descriptionOverride",
                                sourceTranslation.getDescriptionOverride()
                        )
                );


        // ==========================================
        // EJECUTAR TRADUCCIÓN
        // ==========================================

        AiTranslationResult result =
                aiTranslationService.translate(request);


        // ==========================================
        // CONSTRUIR RESPUESTA
        // ==========================================

        HeroBannerAiTranslationResponseDto response =
                new HeroBannerAiTranslationResponseDto();

        response.setSourceLanguageId(
                sourceLanguageId
        );

        response.setTargetLanguageId(
                targetLanguage.getLanguageId()
        );

        response.setSourceTitleOverride(
                sourceTranslation.getTitleOverride()
        );

        response.setSourceDescriptionOverride(
                sourceTranslation.getDescriptionOverride()
        );

        response.setTranslatedTitleOverride(
                result.fields().get("titleOverride")
        );

        response.setTranslatedDescriptionOverride(
                result.fields().get("descriptionOverride")
        );

        return response;
    }

    // ==========================================
    // ELIMINAR UNA TRADUCCIÓN
    // ==========================================

    public void delete(
            Integer bannerId,
            Integer languageId
    ) {

        if (!bannerRepository.existsById(bannerId)) {
            throw new ResourceNotFoundException(
                    "Banner no encontrado: " + bannerId
            );
        }

        HeroBannerTranslation translation =
                translationRepository
                        .findByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
                                bannerId,
                                languageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "La traducción no existe"
                                )
                        );

        translationRepository.delete(translation);
    }
}