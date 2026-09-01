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
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusAiTranslationRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusAiTranslationResponseDto;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusTranslationRequestDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.entities.SupportTicketStatusTranslation;
import com.axher.backend.support.tickets.repositories.SupportTicketStatusRepository;
import com.axher.backend.support.tickets.repositories.SupportTicketStatusTranslationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportTicketStatusTranslationService {

    private final SupportTicketStatusTranslationRepository translationRepository;
    private final SupportTicketStatusRepository statusRepository;
    private final LanguageRepository languageRepository;
    private final AiTranslationService aiTranslationService;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================

    public Optional<SupportTicketStatusTranslation> findByStatusAndLanguage(
            Integer statusId,
            String languageCode
    ) {
        return translationRepository
                .findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_Code(
                        statusId,
                        languageCode
                );
    }

    public Optional<SupportTicketStatusTranslation> findFirstAvailable(
            Integer statusId
    ) {
        return translationRepository
                .findFirstBySupportTicketStatus_SupportTicketStatusId(
                        statusId
                );
    }

    public boolean existsByNameAndLanguageAndStatusNot(
            String name,
            Integer languageId,
            Integer statusId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndSupportTicketStatus_SupportTicketStatusIdNot(
                        name,
                        languageId,
                        statusId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================

    public List<SupportTicketStatusTranslation> findByStatus(
            Integer statusId
    ) {
        if (!statusRepository.existsById(statusId)) {
            throw new ResourceNotFoundException(
                    "Estado de ticket no encontrado: " + statusId
            );
        }

        return translationRepository
                .findBySupportTicketStatus_SupportTicketStatusId(
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
    public SupportTicketStatusTranslation create(
            Integer statusId,
            SupportTicketStatusTranslationRequestDto dto
    ) {
        SupportTicketStatus status =
                statusRepository.findById(statusId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Estado de ticket no encontrado: "
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
                        .existsBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        );

        if (exists) {
            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        SupportTicketStatusTranslation translation =
                new SupportTicketStatusTranslation();

        translation.setSupportTicketStatus(status);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public SupportTicketStatusTranslation update(
            Integer statusId,
            Integer languageId,
            SupportTicketStatusTranslationRequestDto dto
    ) {
        SupportTicketStatusTranslation translation =
                translationRepository
                        .findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
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
    public SupportTicketStatusAiTranslationResponseDto translateWithAi(
            Integer statusId,
            Integer sourceLanguageId,
            SupportTicketStatusAiTranslationRequestDto dto
    ) {

        statusRepository.findById(statusId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de ticket no encontrado: " + statusId
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

        SupportTicketStatusTranslation sourceTranslation =
                translationRepository
                        .findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
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

        SupportTicketStatusAiTranslationResponseDto response =
                new SupportTicketStatusAiTranslationResponseDto();

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
                    "Estado de ticket no encontrado: " + statusId
            );
        }

        SupportTicketStatusTranslation translation =
                translationRepository
                        .findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
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
