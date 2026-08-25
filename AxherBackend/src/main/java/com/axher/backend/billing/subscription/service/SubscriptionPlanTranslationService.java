package com.axher.backend.billing.subscription.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlanTranslation;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlanTranslationRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlansRepository;
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
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public SubscriptionPlanTranslation save(
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
                    "Idioma inactivo: " + dto.getLanguageId()
            );
        }


        SubscriptionPlanTranslation translation =
                translationRepository
                        .findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
                                planId,
                                language.getLanguageId()
                        )
                        .orElseGet(
                                SubscriptionPlanTranslation::new
                        );


        translation.setSubscriptionPlan(plan);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
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
