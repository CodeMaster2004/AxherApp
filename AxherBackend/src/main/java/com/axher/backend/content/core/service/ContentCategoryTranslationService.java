package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentCategoryTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentCategoryTranslation;
import com.axher.backend.content.core.repositories.ContentCategoriesRepository;
import com.axher.backend.content.core.repositories.ContentCategoryTranslationRepository;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentCategoryTranslationService {

    private final ContentCategoryTranslationRepository translationRepository;
    private final ContentCategoriesRepository categoryRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<ContentCategoryTranslation> findByCategoryAndLanguage(
            Integer categoryId,
            String languageCode
    ) {

        return translationRepository
                .findByContentCategory_ContentCategoryIdAndLanguage_Code(
                        categoryId,
                        languageCode
                );
    }

    public Optional<ContentCategoryTranslation> findFirstAvailable(
            Integer categoryId
    ) {
        return translationRepository
                .findFirstByContentCategory_ContentCategoryId(categoryId);
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================

    public List<ContentCategoryTranslation> findByCategory(
            Integer categoryId
    ) {

        if (!categoryRepository.existsById(categoryId)) {

            throw new ResourceNotFoundException(
                    "Categoría no encontrada: " + categoryId
            );
        }

        return translationRepository
                .findByContentCategory_ContentCategoryId(categoryId);
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

    public boolean existsByNameAndLanguageAndCategoryNot(
            String name,
            Integer languageId,
            Integer categoryId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndContentCategory_ContentCategoryIdNot(
                        name,
                        languageId,
                        categoryId
                );
    }

    // ==========================================
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================

    public ContentCategoryTranslation save(
            Integer categoryId,
            ContentCategoryTranslationRequestDto dto
    ) {

        ContentCategories category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Categoría no encontrada: "
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

        ContentCategoryTranslation translation =
                translationRepository
                        .findByContentCategory_ContentCategoryIdAndLanguage_LanguageId(
                                categoryId,
                                language.getLanguageId()
                        )
                        .orElseGet(ContentCategoryTranslation::new);

        translation.setContentCategory(category);
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
                    "Categoría no encontrada: " + categoryId
            );
        }

        ContentCategoryTranslation translation =
                translationRepository
                        .findByContentCategory_ContentCategoryIdAndLanguage_LanguageId(
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