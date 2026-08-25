package com.axher.backend.billing.subscription.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.SubscriptionStatusTranslation;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusTranslationRepository;
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
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public SubscriptionStatusTranslation save(
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
                    "Idioma inactivo: "
                            + dto.getLanguageId()
            );
        }

        SubscriptionStatusTranslation translation =
                translationRepository
                        .findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        )
                        .orElseGet(
                                SubscriptionStatusTranslation::new
                        );

        translation.setSubscriptionStatus(status);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
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
