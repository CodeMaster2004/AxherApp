package com.axher.backend.billing.payment.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.payment.DTOs.PaymentStatusTranslationRequestDto;
import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.entities.PaymentStatusTranslation;
import com.axher.backend.billing.payment.repositories.PaymentStatusRepository;
import com.axher.backend.billing.payment.repositories.PaymentStatusTranslationRepository;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentStatusTranslationService {

    private final PaymentStatusTranslationRepository translationRepository;
    private final PaymentStatusRepository statusRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<PaymentStatusTranslation>
    findByStatusAndLanguage(
            Integer statusId,
            String languageCode
    ) {

        return translationRepository
                .findByPaymentStatus_PaymentStatusIdAndLanguage_Code(
                        statusId,
                        languageCode
                );
    }

    public Optional<PaymentStatusTranslation>
    findFirstAvailable(
            Integer statusId
    ) {

        return translationRepository
                .findFirstByPaymentStatus_PaymentStatusId(
                        statusId
                );
    }

    public boolean existsByNameAndLanguageAndStatusNot(
            String name,
            Integer languageId,
            Integer statusId
    ) {

        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndPaymentStatus_PaymentStatusIdNot(
                        name,
                        languageId,
                        statusId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================
    public List<PaymentStatusTranslation>
    findByStatus(
            Integer statusId
    ) {

        if (!statusRepository.existsById(statusId)) {

            throw new ResourceNotFoundException(
                    "Estado de pago no encontrado: " + statusId
            );
        }

        return translationRepository
                .findByPaymentStatus_PaymentStatusId(
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
    public PaymentStatusTranslation save(
            Integer statusId,
            PaymentStatusTranslationRequestDto dto
    ) {

        PaymentStatus status =
                statusRepository.findById(statusId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Estado de pago no encontrado: "
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

        PaymentStatusTranslation translation =
                translationRepository
                        .findByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        )
                        .orElseGet(
                                PaymentStatusTranslation::new
                        );

        translation.setPaymentStatus(status);
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
                    "Estado de pago no encontrado: "
                            + statusId
            );
        }

        PaymentStatusTranslation translation =
                translationRepository
                        .findByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
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