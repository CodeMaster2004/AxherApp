package com.axher.backend.support.tickets.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.tickets.DTOs.SupportCategoryRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportCategoryTranslationRequestDto;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.repositories.SupportCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportCategoryService {
    
    private final SupportCategoryRepository repository;
    private final SupportCategoryTranslationService translationService;

    public Page<SupportCategory> findAll(Pageable pageable, String search) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository
            .search(
                search,
                pageable
            );
    }

    public SupportCategory findById(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Categoría de soporte no encontrada: " + id
                )
            );
    }

    public SupportCategory getCategory(String code) {

        return repository.findByCode(code)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Categoría de soporte no encontrada: " + code
                )
            );
    }

    public SupportCategory create(SupportCategoryRequestDto dto) {

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

        String normalize = TextNormalizer.normalizeCode(dto.getCode());

        dto.setCode(normalize);

        if (repository.existsByCode(normalize)) {
            throw new DuplicateResourceException(
                "La categoría de soporte ya existe: " + normalize
            );
        }

        if (translationService.existsByNameAndLanguage(
                dto.getName().trim(),
                dto.getLanguageId()
        )) {
            throw new DuplicateResourceException(
                "El nombre ya existe en este idioma: " + dto.getName()
            );
        }

        SupportCategory category = new SupportCategory();

        category.setCode(normalize);

        SupportCategory saved = repository.save(category);

         SupportCategoryTranslationRequestDto translationDto =
                new SupportCategoryTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName());
        translationDto.setDescription(dto.getDescription());

        translationService.create(
                saved.getSupportCategoryId(),
                translationDto
        );

        return saved;
    }

    public SupportCategory update(
        Integer id,
        SupportCategoryRequestDto dto
    ) {

        SupportCategory existing = findById(id);

        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                    "El código de categoría de soporte no puede estar vacío"
                );
            }

            String normalize =
                TextNormalizer.normalizeCode(dto.getCode());

            if (
                !normalize.equals(existing.getCode())
                && repository.existsByCode(normalize)
            ) {
                throw new DuplicateResourceException(
                    "La categoría de soporte ya existe: " + normalize
                );
            }

            existing.setCode(normalize);
        }

        if (dto.getName() != null) {

            String name = dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                    "El nombre de categoría de soporte no puede estar vacío"
                );
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (
                translationService
                    .existsByNameAndLanguageAndCategoryNot(
                        name,
                        dto.getLanguageId(),
                        id
                    )
            ) {
                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: "
                        + name
                );
            }

            SupportCategoryTranslationRequestDto translationDto =
                    new SupportCategoryTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.update(
                    existing.getSupportCategoryId(),
                    dto.getLanguageId(),
                    translationDto
            );
        }

        return repository.save(existing);
    }

    public void delete(Integer id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                "Categoría de soporte no encontrada: " + id
            );
        }

        repository.deleteById(id);
    }


}
