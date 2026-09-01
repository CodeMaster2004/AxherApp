package com.axher.backend.billing.payment.services;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.billing.payment.DTOs.PaymentStatusAiTranslationRequestDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusAiTranslationResponseDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusTranslationRequestDto;
import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.entities.PaymentStatusTranslation;
import com.axher.backend.billing.payment.repositories.PaymentStatusRepository;
import com.axher.backend.billing.payment.repositories.PaymentStatusTranslationRepository;
import com.axher.backend.infrastructure.ai.translation.AiTranslationRequest;
import com.axher.backend.infrastructure.ai.translation.AiTranslationResult;
import com.axher.backend.infrastructure.ai.translation.AiTranslationService;
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
    private final AiTranslationService aiTranslationService;


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
    // CREAR TRADUCCIÓN
    // ==========================================
    public PaymentStatusTranslation create(
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
                            + language.getCode()
            );
        }

        boolean exists =
                translationRepository
                        .existsByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        );

        if (exists) {

            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        PaymentStatusTranslation translation =
                new PaymentStatusTranslation();

        translation.setPaymentStatus(status);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public PaymentStatusTranslation update(
            Integer statusId,
            Integer languageId,
            PaymentStatusTranslationRequestDto dto
    ) {

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

        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON AI
    // ==========================================

    public PaymentStatusAiTranslationResponseDto translateWithAi(
            Integer statusId,
            Integer sourceLanguageId,
            PaymentStatusAiTranslationRequestDto dto
    ) {

        // ------------------------------------------
        // VALIDAR ESTADO
        // ------------------------------------------

        statusRepository.findById(statusId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de pago no encontrado: "
                                        + statusId
                        )
                );

        // ------------------------------------------
        // OBTENER IDIOMA ORIGEN
        // ------------------------------------------

        Language sourceLanguage =
                languageRepository.findById(sourceLanguageId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Idioma origen no encontrado: "
                                                + sourceLanguageId
                                )
                        );

        // ------------------------------------------
        // OBTENER IDIOMA DESTINO
        // ------------------------------------------

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

        // ------------------------------------------
        // VALIDAR IDIOMA ORIGEN
        // ------------------------------------------

        if (!Boolean.TRUE.equals(sourceLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma origen está inactivo: "
                            + sourceLanguage.getCode()
            );
        }

        // ------------------------------------------
        // VALIDAR IDIOMA DESTINO
        // ------------------------------------------

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma destino está inactivo: "
                            + targetLanguage.getCode()
            );
        }

        // ------------------------------------------
        // ORIGEN Y DESTINO NO PUEDEN SER IGUALES
        // ------------------------------------------

        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

            throw new IllegalArgumentException(
                    "El idioma origen y destino no pueden ser iguales"
            );
        }

        // ------------------------------------------
        // OBTENER TRADUCCIÓN ORIGEN
        // ------------------------------------------

        PaymentStatusTranslation sourceTranslation =
                translationRepository
                        .findByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
                                statusId,
                                sourceLanguageId
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No existe una traducción en el idioma origen"
                                )
                        );

        // ------------------------------------------
        // VALIDAR QUE NO EXISTA YA DESTINO
        // ------------------------------------------

        boolean targetExists =
                translationRepository
                        .existsByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
                                statusId,
                                targetLanguage.getLanguageId()
                        );

        if (targetExists) {

            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma destino: "
                            + targetLanguage.getCode()
            );
        }

        // ------------------------------------------
        // PREPARAR SOLICITUD PARA LA IA
        // ------------------------------------------

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

        // ------------------------------------------
        // EJECUTAR TRADUCCIÓN
        // ------------------------------------------

        AiTranslationResult result =
                aiTranslationService.translate(request);

        // ------------------------------------------
        // CONSTRUIR RESPUESTA
        // ------------------------------------------

        PaymentStatusAiTranslationResponseDto response =
                new PaymentStatusAiTranslationResponseDto();

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