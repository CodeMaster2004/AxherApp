package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentStatusAiTranslationRequestDto;
import com.axher.backend.content.core.DTOs.ContentStatusAiTranslationResponseDto;
import com.axher.backend.content.core.DTOs.ContentStatusTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusTranslation;
import com.axher.backend.content.core.repositories.ContentStatusRepository;
import com.axher.backend.content.core.repositories.ContentStatusTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContentStatusTranslationService {

    private final ContentStatusTranslationRepository translationRepository;
    private final ContentStatusRepository statusRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<ContentStatusTranslation> findByStatusAndLanguage(
            Integer statusId,
            String languageCode
    ) {
        return translationRepository
                .findByContentStatus_ContentStatusIdAndLanguage_Code(
                        statusId,
                        languageCode
                );
    }

    public Optional<ContentStatusTranslation> findFirstAvailable(
            Integer statusId
    ) {
        return translationRepository
                .findFirstByContentStatus_ContentStatusId(statusId);
    }

    public boolean existsByNameAndLanguageAndStatusNot(
            String name,
            Integer languageId,
            Integer statusId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndContentStatus_ContentStatusIdNot(
                        name,
                        languageId,
                        statusId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<ContentStatusTranslation> findByStatus(
            Integer statusId
    ) {
        if (!statusRepository.existsById(statusId)) {
            throw new ResourceNotFoundException(
                    "Estado de contenido no encontrado: " + statusId
            );
        }

        return translationRepository
                .findByContentStatus_ContentStatusId(statusId);
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
    public ContentStatusTranslation create(
            Integer statusId,
            ContentStatusTranslationRequestDto dto
    ) {
        ContentStatus status =
                statusRepository.findById(statusId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Estado de contenido no encontrado: "
                                                + statusId
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
                        .findByContentStatus_ContentStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        )
                        .isPresent();

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        ContentStatusTranslation translation =
                new ContentStatusTranslation();

        translation.setContentStatus(status);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public ContentStatusTranslation update(
            Integer statusId,
            Integer languageId,
            ContentStatusTranslationRequestDto dto
    ) {
        ContentStatusTranslation translation =
                translationRepository
                        .findByContentStatus_ContentStatusIdAndLanguage_LanguageId(
                                statusId,
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

    public ContentStatusAiTranslationResponseDto translateWithAi(
            Integer statusId,
            Integer sourceLanguageId,
            ContentStatusAiTranslationRequestDto dto
    ) {

        statusRepository.findById(statusId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de contenido no encontrado: "
                                        + statusId
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

        ContentStatusTranslation sourceTranslation =
                translationRepository
                        .findByContentStatus_ContentStatusIdAndLanguage_LanguageId(
                                statusId,
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

        ContentStatusAiTranslationResponseDto response =
                new ContentStatusAiTranslationResponseDto();

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
            Integer statusId,
            Integer languageId
    ) {

        if (!statusRepository.existsById(statusId)) {
            throw new ResourceNotFoundException(
                    "Estado de contenido no encontrado: " + statusId
            );
        }

        ContentStatusTranslation translation =
                translationRepository
                        .findByContentStatus_ContentStatusIdAndLanguage_LanguageId(
                                statusId,
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
