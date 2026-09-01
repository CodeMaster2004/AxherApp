package com.axher.backend.billing.subscription.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusAiTranslationRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusAiTranslationResponseDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.SubscriptionStatusTranslation;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionStatusTranslationService {

    private final SubscriptionStatusTranslationRepository translationRepository;
    private final SubscriptionStatusRepository statusRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;


    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<SubscriptionStatusTranslation>
    findByStatusAndLanguage(
            Integer statusId,
            String languageCode
    ) {
        return translationRepository
                .findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_Code(
                        statusId,
                        languageCode
                );
    }


    public Optional<SubscriptionStatusTranslation>
    findFirstAvailable(
            Integer statusId
    ) {
        return translationRepository
                .findFirstBySubscriptionStatus_SubscriptionStatusId(
                        statusId
                );
    }


    public boolean existsByNameAndLanguageAndStatusNot(
            String name,
            Integer languageId,
            Integer statusId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndSubscriptionStatus_SubscriptionStatusIdNot(
                        name,
                        languageId,
                        statusId
                );
    }


    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<SubscriptionStatusTranslation>
    findByStatus(
            Integer statusId
    ) {

        if (!statusRepository.existsById(statusId)) {

            throw new ResourceNotFoundException(
                    "Estado de suscripción no encontrado: "
                            + statusId
            );
        }

        return translationRepository
                .findBySubscriptionStatus_SubscriptionStatusId(
                        statusId
                );
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
    public SubscriptionStatusTranslation create(
            Integer statusId,
            SubscriptionStatusTranslationRequestDto dto
    ) {

        SubscriptionStatus status =
                statusRepository.findById(statusId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Estado de suscripción no encontrado: "
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
                        .existsBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        SubscriptionStatusTranslation translation =
                new SubscriptionStatusTranslation();

        translation.setSubscriptionStatus(status);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public SubscriptionStatusTranslation update(
            Integer statusId,
            Integer languageId,
            SubscriptionStatusTranslationRequestDto dto
    ) {

        SubscriptionStatusTranslation translation =
                translationRepository
                        .findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
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

    public SubscriptionStatusAiTranslationResponseDto translateWithAi(
            Integer statusId,
            Integer sourceLanguageId,
            SubscriptionStatusAiTranslationRequestDto dto
    ) {

        // ==========================================
        // VALIDAR ESTADO
        // ==========================================

        statusRepository.findById(statusId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de suscripción no encontrado: "
                                        + statusId
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

        SubscriptionStatusTranslation sourceTranslation =
                translationRepository
                        .findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
                                statusId,
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
                                "name",
                                sourceTranslation.getName(),

                                "description",
                                sourceTranslation.getDescription()
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

        SubscriptionStatusAiTranslationResponseDto response =
                new SubscriptionStatusAiTranslationResponseDto();

        response.setSourceLanguageId(
                sourceLanguageId
        );

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
                    "Estado de suscripción no encontrado: "
                            + statusId
            );
        }


        SubscriptionStatusTranslation translation =
                translationRepository
                        .findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
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
