package com.axher.backend.content.core.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentStatusTranslationRequestDto;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusTranslation;
import com.axher.backend.content.core.repositories.ContentStatusRepository;
import com.axher.backend.content.core.repositories.ContentStatusTranslationRepository;
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
    // CREAR O ACTUALIZAR UNA TRADUCCIÓN
    // ==========================================
    public ContentStatusTranslation save(
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
                    "Idioma inactivo: " + dto.getLanguageId()
            );
        }

        ContentStatusTranslation translation =
                translationRepository
                        .findByContentStatus_ContentStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        )
                        .orElseGet(ContentStatusTranslation::new);

        translation.setContentStatus(status);
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
