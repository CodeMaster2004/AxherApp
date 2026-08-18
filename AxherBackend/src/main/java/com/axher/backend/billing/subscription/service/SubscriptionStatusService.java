package com.axher.backend.billing.subscription.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionStatusService {
    private final SubscriptionStatusRepository repository;

    public Page<SubscriptionStatus> findAll(
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

    public SubscriptionStatus findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de suscripción no encontrado: " + id
                        )
                );
    }

    public SubscriptionStatus getStatus(String code) {

        return repository.findByCode(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Estado de suscripción no encontrado: " + code
                        )
                );
    }

    public SubscriptionStatus create(SubscriptionStatusRequestDto dto) {

        String normalize = TextNormalizer.normalizeCode(dto.getCode());

        dto.setCode(normalize);

        if (repository.existsByCode(normalize)) {
            throw new DuplicateResourceException(
                    "El estado de suscripción ya existe: " + normalize
            );
        }

        if (repository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException(
                    "El nombre de estado de suscripción ya existe: " + dto.getName()
            );
        }

        SubscriptionStatus status = new SubscriptionStatus();

        status.setCode(normalize);
        status.setName(dto.getName());
        status.setDescription(dto.getDescription());

        return repository.save(status);
    }

    public SubscriptionStatus update(
            Integer id,
            SubscriptionStatusRequestDto dto
    ) {

        SubscriptionStatus existing = findById(id);

        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                        "El código del estado de suscripción no puede estar vacío"
                );
            }

            String normalize = TextNormalizer.normalizeCode(dto.getCode());

            if (!normalize.equals(existing.getCode())
                    && repository.existsByCode(normalize)) {

                throw new DuplicateResourceException(
                        "El estado de suscripción ya existe: " + normalize
                );
            }

            existing.setCode(normalize);
        }

        if (dto.getName() != null) {

            if (dto.getName().isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre del estado de suscripción no puede estar vacío"
                );
            }

            if (!dto.getName().equalsIgnoreCase(existing.getName())
                    && repository.existsByNameIgnoreCase(dto.getName())) {

                throw new DuplicateResourceException(
                        "El nombre de estado de suscripción ya existe: "
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
                    "Estado de suscripción no encontrado: " + id
            );
        }

        repository.deleteById(id);
    }
}
