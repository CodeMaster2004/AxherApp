package com.axher.backend.support.reports.service;

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
import com.axher.backend.support.reports.DTOS.ReportStatusAiTranslationRequestDto;
import com.axher.backend.support.reports.DTOS.ReportStatusAiTranslationResponseDto;
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
    private final AiTranslationService aiTranslationService;

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
    // CREAR TRADUCCIÓN
    // ==========================================
    public ReportStatusTranslation create(
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
                    "Idioma inactivo: " + language.getCode()
            );
        }

        boolean exists =
                translationRepository
                        .existsByReportStatus_ReportStatusIdAndLanguage_LanguageId(
                                statusId,
                                language.getLanguageId()
                        );

        if (exists) {

            throw new IllegalStateException(
                    "Ya existe una traducción para el idioma: "
                            + language.getCode()
            );
        }

        ReportStatusTranslation translation =
                new ReportStatusTranslation();

        translation.setReportStatus(status);
        translation.setLanguage(language);
        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // ACTUALIZAR TRADUCCIÓN
    // ==========================================
    public ReportStatusTranslation update(
            Integer statusId,
            Integer languageId,
            ReportStatusTranslationRequestDto dto
    ) {

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

        translation.setName(dto.getName());
        translation.setDescription(dto.getDescription());

        return translationRepository.save(translation);
    }

    // ==========================================
    // TRADUCIR CON IA
    // ==========================================
    public ReportStatusAiTranslationResponseDto translateWithAi(
            Integer statusId,
            Integer sourceLanguageId,
            ReportStatusAiTranslationRequestDto dto

    ) {

        translationRepository.findById(statusId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de reporte no encontrado: " + statusId
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
                    "Idioma origen está inactivo: "
                            + sourceLanguage.getCode()
            );
        }

        if (!Boolean.TRUE.equals(targetLanguage.getActive())) {

            throw new IllegalArgumentException(
                    "Idioma destino está inactivo: "
                            + targetLanguage.getCode()
            );
        }

        if (sourceLanguage.getLanguageId()
                .equals(targetLanguage.getLanguageId())) {

            throw new IllegalArgumentException(
                    "El idioma origen y destino no pueden ser iguales"
            );
        }

        ReportStatusTranslation sourceTranslation =
                translationRepository
                        .findByReportStatus_ReportStatusIdAndLanguage_LanguageId(
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

        ReportStatusAiTranslationResponseDto response =
                new ReportStatusAiTranslationResponseDto();

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
