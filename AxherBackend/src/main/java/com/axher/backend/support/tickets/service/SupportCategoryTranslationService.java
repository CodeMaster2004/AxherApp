package com.axher.backend.support.tickets.service;

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
import com.axher.backend.support.tickets.DTOs.SupportCategoryAiTranslationRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportCategoryAiTranslationResponseDto;
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
    private final AiTranslationService aiTranslationService;

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

    public SupportCategoryTranslation create(
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
                        "Idioma inactivo: " + language.getCode()
                );
        }

        boolean exists =
                translationRepository
                        .existsBySupportCategory_SupportCategoryIdAndLanguage_LanguageId(
                                categoryId,
                                language.getLanguageId()
                        );

        if (exists) {
                throw new IllegalStateException(
                        "Ya existe una traducción para el idioma: "
                                + language.getCode()
                );
        }

        SupportCategoryTranslation translation =
                new SupportCategoryTranslation();

        translation.setSupportCategory(category);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public SupportCategoryTranslation update(
        Integer categoryId,
        Integer languageId,
        SupportCategoryTranslationRequestDto dto
    ) {
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

        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON IA
    // ==========================================

    public SupportCategoryAiTranslationResponseDto translateWithAi(
            Integer categoryId,
            Integer sourceLanguageId,
            SupportCategoryAiTranslationRequestDto dto
    ) {

        categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría de soporte no encontrada: "
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
                        "Idioma origen esta inactivo: "
                                + sourceLanguage.getCode()
                );
        }

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {
                throw new IllegalArgumentException(
                        "Idioma destino esta inactivo: "
                                + targetLanguage.getCode()
                );
        }

        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

                throw new IllegalArgumentException(
                        "El idioma origen y destino no pueden ser iguales"
                );
        }

        SupportCategoryTranslation sourceTranslation =
                translationRepository
                        .findBySupportCategory_SupportCategoryIdAndLanguage_LanguageId(
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

        SupportCategoryAiTranslationResponseDto response =
                new SupportCategoryAiTranslationResponseDto();

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
