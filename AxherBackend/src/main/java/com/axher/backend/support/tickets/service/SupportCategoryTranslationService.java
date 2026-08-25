package com.axher.backend.support.tickets.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.tickets.DTOs.SupportCategoryTranslationRequestDto;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.entities.SupportCategoryTranslation;
import com.axher.backend.support.tickets.repositories.SupportCategoryRepository;
import com.axher.backend.support.tickets.repositories.SupportCategoryTranslationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportCategoryTranslationService {

    private final SupportCategoryTranslationRepository translationRepository;
    private final SupportCategoryRepository categoryRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<SupportCategoryTranslation> findByCategoryAndLanguage(
            Integer categoryId,
            String languageCode
    ) {
        return translationRepository
                .findBySupportCategory_SupportCategoryIdAndLanguage_Code(
                        categoryId,
                        languageCode
                );
    }

    public Optional<SupportCategoryTranslation> findFirstAvailable(
            Integer categoryId
    ) {
        return translationRepository
                .findFirstBySupportCategory_SupportCategoryId(categoryId);
    }

    public boolean existsByNameAndLanguageAndCategoryNot(
            String name,
            Integer languageId,
            Integer categoryId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndSupportCategory_SupportCategoryIdNot(
                        name,
                        languageId,
                        categoryId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================

    public List<SupportCategoryTranslation> findByCategory(
            Integer categoryId
    ) {

        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException(
                    "Categoría de soporte no encontrada: " + categoryId
            );
        }

        return translationRepository
                .findBySupportCategory_SupportCategoryId(categoryId);
    }

    public boolean existsByNameAndLanguage(
            String name,
            Integer languageId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageId(
                        name,
                        languageId
                );
    }

    // ==========================================
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================

    public SupportCategoryTranslation save(
            Integer categoryId,
            SupportCategoryTranslationRequestDto dto
    ) {

        SupportCategory category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Categoría de soporte no encontrada: "
                                                + categoryId
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
                    "Idioma inactivo: " + dto.getLanguageId()
            );
        }

        SupportCategoryTranslation translation =
                translationRepository
                        .findBySupportCategory_SupportCategoryIdAndLanguage_LanguageId(
                                categoryId,
                                language.getLanguageId()
                        )
                        .orElseGet(
                                SupportCategoryTranslation::new
                        );

        translation.setSupportCategory(category);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ELIMINAR UNA TRADUCCIÓN
    // ==========================================

    public void delete(
            Integer categoryId,
            Integer languageId
    ) {

        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException(
                    "Categoría de soporte no encontrada: " + categoryId
            );
        }

        SupportCategoryTranslation translation =
                translationRepository
                        .findBySupportCategory_SupportCategoryIdAndLanguage_LanguageId(
                                categoryId,
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
