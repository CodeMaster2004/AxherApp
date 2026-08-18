package com.axher.backend.support.tickets.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.tickets.DTOs.SupportCategoryRequestDto;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.repositories.SupportCategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportCategoryService {
    
    private final SupportCategoryRepository repository;

    public Page<SupportCategory> findAll(Pageable pageable, String search) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository
            .findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                search,
                search,
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

        String normalize = TextNormalizer.normalizeCode(dto.getCode());

        dto.setCode(normalize);

        if (repository.existsByCode(normalize)) {
            throw new DuplicateResourceException(
                "La categoría de soporte ya existe: " + normalize
            );
        }

        if (repository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException(
                "El nombre de categoría de soporte ya existe: "
                + dto.getName()
            );
        }

        SupportCategory category = new SupportCategory();

        category.setCode(normalize);
        category.setName(dto.getName());
        category.setDescription(dto.getDescription());

        return repository.save(category);
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

            if (dto.getName().isBlank()) {
                throw new IllegalArgumentException(
                    "El nombre de categoría de soporte no puede estar vacío"
                );
            }

            if (
                !dto.getName().equalsIgnoreCase(existing.getName())
                && repository.existsByNameIgnoreCase(dto.getName())
            ) {
                throw new DuplicateResourceException(
                    "El nombre de categoría de soporte ya existe: "
                    + dto.getName()
                );
            }

            existing.setName(dto.getName());
        }

        if (dto.getDescription() != null) {
            existing.setDescription(dto.getDescription());
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
