package com.axher.backend.support.reports.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.reports.DTOS.ReportCategoryTranslationRequestDto;
import com.axher.backend.support.reports.entities.ReportCategory;
import com.axher.backend.support.reports.entities.ReportCategoryTranslation;
import com.axher.backend.support.reports.repositories.ReportCategoryRepository;
import com.axher.backend.support.reports.repositories.ReportCategoryTranslationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportCategoryTranslationService {

    private final ReportCategoryTranslationRepository translationRepository;
    private final ReportCategoryRepository categoryRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<ReportCategoryTranslation> findByCategoryAndLanguage(
            Integer categoryId,
            String languageCode
    ) {

        return translationRepository
                .findByReportCategory_ReportCategoryIdAndLanguage_Code(
                        categoryId,
                        languageCode
                );
    }

    public Optional<ReportCategoryTranslation> findFirstAvailable(
            Integer categoryId
    ) {

        return translationRepository
                .findFirstByReportCategory_ReportCategoryId(categoryId);
    }

    public boolean existsByNameAndLanguageAndCategoryNot(
            String name,
            Integer languageId,
            Integer categoryId
    ) {

        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndReportCategory_ReportCategoryIdNot(
                        name,
                        languageId,
                        categoryId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<ReportCategoryTranslation> findByCategory(
            Integer categoryId
    ) {

        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException(
                    "Categoría de reporte no encontrada: " + categoryId
            );
        }

        return translationRepository
                .findByReportCategory_ReportCategoryId(categoryId);
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
    public ReportCategoryTranslation save(
            Integer categoryId,
            ReportCategoryTranslationRequestDto dto
    ) {

        ReportCategory category =
                categoryRepository.findById(categoryId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Categoría de reporte no encontrada: "
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

        ReportCategoryTranslation translation =
                translationRepository
                        .findByReportCategory_ReportCategoryIdAndLanguage_LanguageId(
                                categoryId,
                                language.getLanguageId()
                        )
                        .orElseGet(ReportCategoryTranslation::new);

        translation.setReportCategory(category);
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
                    "Categoría de reporte no encontrada: " + categoryId
            );
        }

        ReportCategoryTranslation translation =
                translationRepository
                        .findByReportCategory_ReportCategoryIdAndLanguage_LanguageId(
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
