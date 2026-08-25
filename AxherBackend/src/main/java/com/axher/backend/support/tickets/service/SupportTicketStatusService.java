package com.axher.backend.support.tickets.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusTranslationRequestDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.repositories.SupportTicketStatusRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportTicketStatusService {
    
    private final SupportTicketStatusRepository repository;
    private final SupportTicketStatusTranslationService translationService;

    public Page<SupportTicketStatus> findAll(
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

    public SupportTicketStatus findById(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Estado de ticket no encontrado: " + id
                )
            );
    }

    public SupportTicketStatus getStatus(String code) {

        return repository.findByCode(code)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Estado de ticket no encontrado: " + code
                )
            );
    }

    public SupportTicketStatus create(
        SupportTicketStatusRequestDto dto
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

        String normalize =
            TextNormalizer.normalizeCode(dto.getCode());


        if (repository.existsByCode(normalize)) {
            throw new DuplicateResourceException(
                "El estado de ticket ya existe: " + normalize
            );
        }

        if (translationService.existsByNameAndLanguage(
                dto.getName().trim(),
                dto.getLanguageId()
        )) {
            throw new DuplicateResourceException(
                    "El nombre ya existe en este idioma: "
                            + dto.getName()
            );
        }
        SupportTicketStatus status = new SupportTicketStatus();

        status.setCode(normalize);

        SupportTicketStatus saved = repository.save(status);

        SupportTicketStatusTranslationRequestDto translationDto =
                new SupportTicketStatusTranslationRequestDto();
        
        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName().trim());
        translationDto.setDescription(dto.getDescription());

        translationService.save(
                saved.getSupportTicketStatusId(),
                translationDto
        );

        return saved;
    }

    public SupportTicketStatus update(
        Integer id,
        SupportTicketStatusRequestDto dto
    ) {

        SupportTicketStatus existing = findById(id);

        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                    "El código de estado de ticket no puede estar vacío"
                );
            }

            String normalize =
                TextNormalizer.normalizeCode(dto.getCode());

            if (
                !normalize.equals(existing.getCode())
                && repository.existsByCode(normalize)
            ) {
                throw new DuplicateResourceException(
                    "El estado de ticket ya existe: " + normalize
                );
            }

            existing.setCode(normalize);
        }

        if (dto.getName() != null) {

            String name = dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre de estado de ticket no puede estar vacío"
                );
            }


            if (
                translationService
                    .existsByNameAndLanguageAndStatusNot(
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

            SupportTicketStatusTranslationRequestDto translationDto =
                    new SupportTicketStatusTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.save(
                    existing.getSupportTicketStatusId(),
                    translationDto
            );
        }


        return repository.save(existing);
    }

    public void delete(Integer id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                "Estado de ticket no encontrado: " + id
            );
        }

        repository.deleteById(id);
    }
}
