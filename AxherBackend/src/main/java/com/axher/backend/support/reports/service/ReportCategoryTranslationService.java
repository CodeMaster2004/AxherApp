package com.axher.backend.support.reports.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.reports.DTOS.ReportCategoryAiTranslationRequestDto;
import com.axher.backend.support.reports.DTOS.ReportCategoryAiTranslationResponseDto;
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
    private final AiTranslationService aiTranslationService;

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
    // CREAR TRADUCCIÓN
    // ==========================================
    public ReportCategoryTranslation create(
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
                    "Idioma inactivo: " + language.getCode()
            );
        }

        boolean exists =
                translationRepository
                        .existsByReportCategory_ReportCategoryIdAndLanguage_LanguageId(
                                categoryId,
                                language.getLanguageId()
                        );

        if (exists) {

            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        ReportCategoryTranslation translation =
                new ReportCategoryTranslation();

        translation.setReportCategory(category);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public ReportCategoryTranslation update(
            Integer categoryId,
            Integer languageId,
            ReportCategoryTranslationRequestDto dto
    ) {

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

        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON IA
    // ==========================================
    public ReportCategoryAiTranslationResponseDto translateWithAi(
            Integer categoryId,
            Integer sourceLanguageId,
            ReportCategoryAiTranslationRequestDto dto

    ) {

        categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría de reporte no encontrada: "
                                        + categoryId
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

        ReportCategoryTranslation sourceTranslation =
                translationRepository
                        .findByReportCategory_ReportCategoryIdAndLanguage_LanguageId(
                                categoryId,
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
                                "name",
                                sourceTranslation.getName(),

                                "description",
                                sourceTranslation.getDescription()
                        )
                );

        AiTranslationResult result =
                aiTranslationService.translate(request);

        ReportCategoryAiTranslationResponseDto response =
                new ReportCategoryAiTranslationResponseDto();

        response.setSourceLanguageId(sourceLanguageId);

        response.setTargetLanguageId(
                targetLanguage.getLanguageId()
        );

        response.setSourceName(
                sourceTranslation.getName()
        );

        response.setSourceDescription(
                sourceTranslation.getDescription()
        );

        response.setTranslatedName(
                result.fields().get("name")
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
