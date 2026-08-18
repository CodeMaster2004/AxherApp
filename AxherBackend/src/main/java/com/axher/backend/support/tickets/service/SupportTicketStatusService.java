package com.axher.backend.support.tickets.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;
import com.axher.backend.support.tickets.DTOs.SupportTicketStatusRequestDto;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.repositories.SupportTicketStatusRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SupportTicketStatusService {
    
    private final SupportTicketStatusRepository repository;

    public Page<SupportTicketStatus> findAll(
        Pageable pageable,
        String search
    ) {

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

        String normalize =
            TextNormalizer.normalizeCode(dto.getCode());

        dto.setCode(normalize);

        if (repository.existsByCode(normalize)) {
            throw new DuplicateResourceException(
                "El estado de ticket ya existe: " + normalize
            );
        }

        if (repository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException(
                "El nombre de estado de ticket ya existe: "
                + dto.getName()
            );
        }

        SupportTicketStatus status = new SupportTicketStatus();

        status.setCode(normalize);
        status.setName(dto.getName());
        status.setDescription(dto.getDescription());

        return repository.save(status);
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

            if (dto.getName().isBlank()) {
                throw new IllegalArgumentException(
                    "El nombre de estado de ticket no puede estar vacío"
                );
            }

            if (
                !dto.getName().equalsIgnoreCase(existing.getName())
                && repository.existsByNameIgnoreCase(dto.getName())
            ) {
                throw new DuplicateResourceException(
                    "El nombre de estado de ticket ya existe: "
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
                "Estado de ticket no encontrado: " + id
            );
        }

        repository.deleteById(id);
    }
}
