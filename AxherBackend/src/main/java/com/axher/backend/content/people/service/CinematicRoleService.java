package com.axher.backend.content.people.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.people.Dtos.CinematicRoleRequestDto;
import com.axher.backend.content.people.Dtos.CinematicRoleTranslationRequestDto;
import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.repositories.CinematicRoleRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class CinematicRoleService {

    private final CinematicRoleRepository repository;
    private final CinematicRoleTranslationService translationService;


    // ==========================================
    // LISTAR
    // ==========================================
    public Page<CinematicRole> findAll(
            Pageable pageable,
            Integer languageId,
            String search
    ) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository.search(
                search.trim(),
                languageId,
                pageable
        );
    }
    // ==========================================
    // OBTENER POR ID
    // ==========================================
    public CinematicRole findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol cinematográfico no encontrado: "
                                        + id
                        )
                );
    }


    // ==========================================
    // OBTENER POR CODE
    // ==========================================
    public CinematicRole findByCode(String code) {

        String normalizedCode =
                TextNormalizer.normalizeCode(code);

        return repository.findByCode(normalizedCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Rol cinematográfico no encontrado: "
                                        + normalizedCode
                        )
                );
    }


    // ==========================================
    // CREAR
    // ==========================================
    public CinematicRole create(
            CinematicRoleRequestDto dto
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
                    "El rol cinematográfico ya existe: "
                            + normalizedCode
            );
        }

        if (translationService
                .existsByNameAndLanguage(
                        dto.getName().trim(),
                        dto.getLanguageId()
                )) {

            throw new DuplicateResourceException(
                    "El nombre ya existe en este idioma: "
                            + dto.getName()
            );
        }

        CinematicRole role =
                new CinematicRole();

        role.setCode(normalizedCode);

        CinematicRole saved =
                repository.save(role);

        CinematicRoleTranslationRequestDto translationDto =
                new CinematicRoleTranslationRequestDto();

        translationDto.setLanguageId(
                dto.getLanguageId()
        );

        translationDto.setName(
                dto.getName().trim()
        );

        translationDto.setDescription(
                dto.getDescription()
        );

        translationService.create(
                saved.getCinematicRoleId(),
                translationDto
        );

        return saved;
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    public CinematicRole update(
            Integer id,
            CinematicRoleRequestDto dto
    ) {

        CinematicRole existing =
                findById(id);

        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                        "El código no puede estar vacío"
                );
            }

            String normalized =
                    TextNormalizer.normalizeCode(
                            dto.getCode()
                    );

            if (!normalized.equals(existing.getCode())
                    && repository.existsByCode(normalized)) {

                throw new DuplicateResourceException(
                        "El rol cinematográfico ya existe: "
                                + normalized
                );
            }

            existing.setCode(normalized);
        }


        // ==========================================
        // TRADUCCIÓN
        // ==========================================

        if (dto.getName() != null) {

            String name =
                    dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre no puede estar vacío"
                );
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService
                    .existsByNameAndLanguageAndRoleNot(
                            name,
                            dto.getLanguageId(),
                            id
                    )) {

                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: "
                                + name
                );
            }

            CinematicRoleTranslationRequestDto translationDto =
                    new CinematicRoleTranslationRequestDto();

            translationDto.setLanguageId(
                    dto.getLanguageId()
            );

            translationDto.setName(name);

            translationDto.setDescription(
                    dto.getDescription()
            );

            translationService.update(
                    existing.getCinematicRoleId(),
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
                    "Rol cinematográfico no encontrado: "
                            + id
            );
        }

        repository.deleteById(id);
    }
}
