package com.axher.backend.support.tickets.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
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
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================

    public SupportTicketStatusTranslation save(
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
                    "Idioma inactivo: " + dto.getLanguageId()
            );
        }

        SupportTicketStatusTranslation translation =
                translationRepository
                        .findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        )
                        .orElseGet(
                                SupportTicketStatusTranslation::new
                        );

        translation.setSupportTicketStatus(status);
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
