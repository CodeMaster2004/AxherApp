package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentCategoryAiTranslationRequestDto;
import com.axher.backend.content.core.DTOs.ContentCategoryAiTranslationResponseDto;
import com.axher.backend.content.core.DTOs.ContentCategoryTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentCategoryTranslation;
import com.axher.backend.content.core.repositories.ContentCategoriesRepository;
import com.axher.backend.content.core.repositories.ContentCategoryTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
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
    private final AiTranslationService aiTranslationService;

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
    // CREAR UNA TRADUCCIÓN
    // ==========================================
    public ContentCategoryTranslation create(
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
                    "Idioma inactivo: " + language.getCode()
            );
        }

        boolean exists =
                translationRepository
                        .findByContentCategory_ContentCategoryIdAndLanguage_LanguageId(
                                categoryId,
                                language.getLanguageId()
                        )
                        .isPresent();

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        ContentCategoryTranslation translation =
                new ContentCategoryTranslation();

        translation.setContentCategory(category);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public ContentCategoryTranslation update(
            Integer categoryId,
            Integer languageId,
            ContentCategoryTranslationRequestDto dto
    ) {
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

        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================

    public ContentCategoryAiTranslationResponseDto translateWithAi(
            Integer categoryId,
            Integer sourceLanguageId,
            ContentCategoryAiTranslationRequestDto dto
    ) {

        categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría no encontrada: " + categoryId
                        )
                );

        Language sourceLanguage = languageRepository.findById(
                sourceLanguageId
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Idioma origen no encontrado: "
                                + sourceLanguageId
                )
        );

        Language targetLanguage = languageRepository.findById(
                dto.getTargetLanguageId()
        ).orElseThrow(() ->
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

        ContentCategoryTranslation sourceTranslation =
                translationRepository
                        .findByContentCategory_ContentCategoryIdAndLanguage_LanguageId(
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

        ContentCategoryAiTranslationResponseDto response =
                new ContentCategoryAiTranslationResponseDto();

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