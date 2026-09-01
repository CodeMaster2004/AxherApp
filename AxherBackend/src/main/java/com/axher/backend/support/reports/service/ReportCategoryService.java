package com.axher.backend.support.reports.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.reports.DTOS.ReportCategoryRequestDto;
import com.axher.backend.support.reports.DTOS.ReportCategoryTranslationRequestDto;
import com.axher.backend.support.reports.entities.ReportCategory;
import com.axher.backend.support.reports.repositories.ReportCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportCategoryService {

    private final ReportCategoryRepository repository;
    private final ReportCategoryTranslationService translationService;

    // ==========================================
    // OBTENER LISTADO
    // ==========================================

    public Page<ReportCategory> findAll(
            Pageable pageable,
            Integer languageId,
            String search
    ) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository
                .search(
                        search,
                        languageId,
                        pageable
                );
    }

    // ==========================================
    // OBTENER POR ID
    // ==========================================

    public ReportCategory findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría de reporte no encontrada: " + id
                        )
                );
    }

    // ==========================================
    // OBTENER POR CODE
    // ==========================================

    public ReportCategory getCategory(String code) {

        return repository.findByCode(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Categoría de reporte no encontrada: " + code
                        )
                );
    }

    // ==========================================
    // CREAR
    // ==========================================

    public ReportCategory create(
            ReportCategoryRequestDto dto
    ) {

        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new IllegalArgumentException(
                    "El código no puede estar vacío"
            );
        }

        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "El nombre no puede estar vacío"
            );
        }

        if (dto.getLanguageId() == null) {
            throw new IllegalArgumentException(
                    "El idioma es obligatorio"
            );
        }

        String normalizedCode =
                TextNormalizer.normalizeCode(dto.getCode());

        if (repository.existsByCode(normalizedCode)) {
            throw new DuplicateResourceException(
                    "La categoría de reporte ya existe: "
                            + normalizedCode
            );
        }

        String name = dto.getName().trim();

        if (translationService.existsByNameAndLanguage(
                name,
                dto.getLanguageId()
        )) {
            throw new DuplicateResourceException(
                    "El nombre ya existe en este idioma: "
                            + name
            );
        }

        ReportCategory category = new ReportCategory();

        category.setCode(normalizedCode);

        ReportCategory saved =
                repository.save(category);

        ReportCategoryTranslationRequestDto translationDto =
                new ReportCategoryTranslationRequestDto();

        translationDto.setLanguageId(
                dto.getLanguageId()
        );

        translationDto.setName(name);

        translationDto.setDescription(
                dto.getDescription()
        );

        translationService.create(
                saved.getReportCategoryId(),
                translationDto
        );

        return saved;
    }

    // ==========================================
    // ACTUALIZAR
    // ==========================================

    public ReportCategory update(
            Integer id,
            ReportCategoryRequestDto dto
    ) {

        ReportCategory existing =
                findById(id);

        // ==========================
        // CODE
        // ==========================

        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                        "La categoría de reporte no puede estar vacía"
                );
            }

            String normalized =
                    TextNormalizer.normalizeCode(
                            dto.getCode()
                    );

            if (!normalized.equals(existing.getCode())
                    && repository.existsByCode(normalized)) {

                throw new DuplicateResourceException(
                        "La categoría de reporte ya existe: "
                                + normalized
                );
            }

            existing.setCode(normalized);
        }

        // ==========================
        // TRADUCCIÓN
        // ==========================

        if (dto.getName() != null) {

            String name =
                    dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre de la categoría de reporte no puede estar vacío"
                );
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService
                    .existsByNameAndLanguageAndCategoryNot(
                            name,
                            dto.getLanguageId(),
                            id
                    )) {

                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: "
                                + name
                );
            }

            ReportCategoryTranslationRequestDto translationDto =
                    new ReportCategoryTranslationRequestDto();

            translationDto.setLanguageId(
                    dto.getLanguageId()
            );

            translationDto.setName(name);

            translationDto.setDescription(
                    dto.getDescription()
            );

            translationService.update(
                    existing.getReportCategoryId(),
                    dto.getLanguageId(),
                    translationDto
            );
        }

        return repository.save(existing);
    }

    // ==========================================
    // ELIMINAR
    // ==========================================

    public void delete(Integer id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Categoría de reporte no encontrada: " + id
            );
        }

        repository.deleteById(id);
    }
}
