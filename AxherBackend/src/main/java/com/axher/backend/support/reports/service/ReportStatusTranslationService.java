package com.axher.backend.support.reports.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.support.reports.DTOS.ReportStatusTranslationRequestDto;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.entities.ReportStatusTranslation;
import com.axher.backend.support.reports.repositories.ReportStatusRepository;
import com.axher.backend.support.reports.repositories.ReportStatusTranslationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportStatusTranslationService {

    private final ReportStatusTranslationRepository translationRepository;
    private final ReportStatusRepository statusRepository;
    private final LanguageRepository languageRepository;

    // ==========================================
    // OBTENER UNA TRADUCCIÓN
    // ==========================================
    public Optional<ReportStatusTranslation> findByStatusAndLanguage(
            Integer statusId,
            String languageCode
    ) {
        return translationRepository
                .findByReportStatus_ReportStatusIdAndLanguage_Code(
                        statusId,
                        languageCode
                );
    }

    public Optional<ReportStatusTranslation> findFirstAvailable(
            Integer statusId
    ) {
        return translationRepository
                .findFirstByReportStatus_ReportStatusId(statusId);
    }

    public boolean existsByNameAndLanguageAndStatusNot(
            String name,
            Integer languageId,
            Integer statusId
    ) {
        return translationRepository
                .existsByNameIgnoreCaseAndLanguage_LanguageIdAndReportStatus_ReportStatusIdNot(
                        name,
                        languageId,
                        statusId
                );
    }

    // ==========================================
    // OBTENER TODAS LAS TRADUCCIONES
    // ==========================================

    public List<ReportStatusTranslation> findByStatus(
            Integer statusId
    ) {
        if (!statusRepository.existsById(statusId)) {
            throw new ResourceNotFoundException(
                    "Estado de reporte no encontrado: " + statusId
            );
        }

        return translationRepository
                .findByReportStatus_ReportStatusId(statusId);
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
    public ReportStatusTranslation save(
            Integer statusId,
            ReportStatusTranslationRequestDto dto
    ) {
        ReportStatus status =
                statusRepository.findById(statusId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Estado de reporte no encontrado: "
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

        ReportStatusTranslation translation =
                translationRepository
                        .findByReportStatus_ReportStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        )
                        .orElseGet(ReportStatusTranslation::new);

        translation.setReportStatus(status);
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
                    "Estado de reporte no encontrado: " + statusId
            );
        }

        ReportStatusTranslation translation =
                translationRepository
                        .findByReportStatus_ReportStatusIdAndLanguage_LanguageId(
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
