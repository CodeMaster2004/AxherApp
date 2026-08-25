package com.axher.backend.language.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.language.DTOs.LanguageRequestDto;
import com.axher.backend.language.DTOs.LanguageResponseDto;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LanguageService {

    private final LanguageRepository repository;


    public Page<Language> findAll(Pageable pageable, String search) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository
                .findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrNativeNameContainingIgnoreCase(
                        search,
                        search,
                        search,
                        pageable
                );
    }


    public Language findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Idioma no encontrado: " + id
                        )
                );
    }


    public Language getByCode(String code) {

        return repository.findByCodeIgnoreCase(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Idioma no encontrado: " + code
                        )
                );
    }

    @Transactional(readOnly = true)
        public Optional<Language> findActiveByCode(String code) {

        if (code == null || code.isBlank()) {
                return Optional.empty();
        }

        return repository
                .findByCodeIgnoreCase(code)
                .filter(Language::getActive);
        }
        
    @Transactional(readOnly = true)
    public List<LanguageResponseDto> getActiveLanguages() {

        return repository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }


    public Language create(LanguageRequestDto dto) {

        String normalizedCode =
                TextNormalizer.normalize(dto.getCode());

        dto.setCode(normalizedCode);

        if (repository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new DuplicateResourceException(
                    "El código de idioma ya existe: " + normalizedCode
            );
        }

        if (repository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException(
                    "El nombre del idioma ya existe: " + dto.getName()
            );
        }

        if (repository.existsByNativeNameIgnoreCase(dto.getNativeName())) {
            throw new DuplicateResourceException(
                    "El nombre nativo del idioma ya existe: " + dto.getNativeName()
            );
        }

        Language language = new Language();

        language.setCode(normalizedCode);
        language.setName(dto.getName());
        language.setNativeName(dto.getNativeName());
        language.setActive(
                dto.getActive() != null ? dto.getActive() : true
        );

        return repository.save(language);
    }


    public Language update(Integer id, LanguageRequestDto dto) {

        Language existing = findById(id);


        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                        "El código del idioma no puede estar vacío"
                );
            }

            String normalizedCode =
                    TextNormalizer.normalize(dto.getCode());

            if (!normalizedCode.equalsIgnoreCase(existing.getCode())
                    && repository.existsByCodeIgnoreCase(normalizedCode)) {

                throw new DuplicateResourceException(
                        "El código de idioma ya existe: " + normalizedCode
                );
            }

            existing.setCode(normalizedCode);
        }


        if (dto.getName() != null) {

            if (dto.getName().isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre del idioma no puede estar vacío"
                );
            }

            if (!dto.getName().equalsIgnoreCase(existing.getName())
                    && repository.existsByNameIgnoreCase(dto.getName())) {

                throw new DuplicateResourceException(
                        "El nombre del idioma ya existe: " + dto.getName()
                );
            }

            existing.setName(dto.getName());
        }


        if (dto.getNativeName() != null) {

            if (dto.getNativeName().isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre nativo del idioma no puede estar vacío"
                );
            }

            if (!dto.getNativeName()
                    .equalsIgnoreCase(existing.getNativeName())
                    && repository.existsByNativeNameIgnoreCase(
                            dto.getNativeName())) {

                throw new DuplicateResourceException(
                        "El nombre nativo del idioma ya existe: "
                                + dto.getNativeName()
                );
            }

            existing.setNativeName(dto.getNativeName());
        }


        if (dto.getActive() != null) {
            existing.setActive(dto.getActive());
        }

        return repository.save(existing);
    }


    public void delete(Integer id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Idioma no encontrado: " + id
            );
        }

        repository.deleteById(id);
    }

    private LanguageResponseDto toResponseDto(Language language) {

        LanguageResponseDto dto = new LanguageResponseDto();

        dto.setLanguageId(language.getLanguageId());
        dto.setCode(language.getCode());
        dto.setName(language.getName());
        dto.setNativeName(language.getNativeName());
        dto.setActive(language.getActive());

        return dto;
    }
    
}
