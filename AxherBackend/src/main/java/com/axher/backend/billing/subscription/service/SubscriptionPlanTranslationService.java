package com.axher.backend.billing.subscription.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanAiTranslationRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanAiTranslationResponseDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlanTranslation;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlanTranslationRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlansRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanTranslationService {

    private final SubscriptionPlanTranslationRepository translationRepository;
    private final SubscriptionPlansRepository planRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;


    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<SubscriptionPlanTranslation>
    findByPlanAndLanguage(
            Integer planId,
            String languageCode
    ) {

        return translationRepository
                .findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_Code(
                        planId,
                        languageCode
                );
    }


    public Optional<SubscriptionPlanTranslation>
    findFirstAvailable(
            Integer planId
    ) {

        return translationRepository
                .findFirstBySubscriptionPlan_SubscriptionPlanId(
                        planId
                );
    }


    public boolean existsByNameAndLanguageAndPlanNot(
            String name,
            Integer languageId,
            Integer planId
    ) {

        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndSubscriptionPlan_SubscriptionPlanIdNot(
                        name,
                        languageId,
                        planId
                );
    }


    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<SubscriptionPlanTranslation>
    findByPlan(
            Integer planId
    ) {

        if (!planRepository.existsById(planId)) {

            throw new ResourceNotFoundException(
                    "Plan de suscripción no encontrado: " + planId
            );
        }

        return translationRepository
                .findBySubscriptionPlan_SubscriptionPlanId(
                        planId
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
    public SubscriptionPlanTranslation create(
            Integer planId,
            SubscriptionPlanTranslationRequestDto dto
    ) {

        SubscriptionPlans plan =
                planRepository.findById(planId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Plan de suscripción no encontrado: "
                                                + planId
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
                        .existsBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
                                planId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        SubscriptionPlanTranslation translation =
                new SubscriptionPlanTranslation();

        translation.setSubscriptionPlan(plan);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public SubscriptionPlanTranslation update(
            Integer planId,
            Integer languageId,
            SubscriptionPlanTranslationRequestDto dto
    ) {

        SubscriptionPlanTranslation translation =
                translationRepository
                        .findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
                                planId,
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

    public SubscriptionPlanAiTranslationResponseDto translateWithAi(
            Integer planId,
            Integer sourceLanguageId,
            SubscriptionPlanAiTranslationRequestDto dto
    ) {

        // ==========================================
        // VALIDAR PLAN
        // ==========================================

        planRepository.findById(planId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Plan de suscripción no encontrado: "
                                        + planId
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

        SubscriptionPlanTranslation sourceTranslation =
                translationRepository
                        .findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
                                planId,
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

        SubscriptionPlanAiTranslationResponseDto response =
                new SubscriptionPlanAiTranslationResponseDto();

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
            Integer planId,
            Integer languageId
    ) {

        if (!planRepository.existsById(planId)) {

            throw new ResourceNotFoundException(
                    "Plan de suscripción no encontrado: " + planId
            );
        }


        SubscriptionPlanTranslation translation =
                translationRepository
                        .findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
                                planId,
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
