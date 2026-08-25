package com.axher.backend.catalog.banner.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.banner.DTOs.HeroBannerTranslationRequestDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.entities.HeroBannerTranslation;
import com.axher.backend.catalog.banner.repositories.HeroBannerRepository;
import com.axher.backend.catalog.banner.repositories.HeroBannerTranslationRepository;
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
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================

    public HeroBannerTranslation save(
            Integer bannerId,
            HeroBannerTranslationRequestDto dto
    ) {

        HeroBanner banner =
                bannerRepository.findById(bannerId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Banner no encontrado: "
                                                + bannerId
                                )
                        );

        Language language =
                languageRepository.findById(dto.getLanguageId())
                        .orElseThrow(() ->
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

        HeroBannerTranslation translation =
                translationRepository
                        .findByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
                                bannerId,
                                language.getLanguageId()
                        )
                        .orElseGet(
                                HeroBannerTranslation::new
                        );

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