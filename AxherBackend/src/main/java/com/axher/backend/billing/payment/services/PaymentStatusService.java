package com.axher.backend.billing.payment.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.payment.DTOs.PaymentStatusRequestDto;
import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.repositories.PaymentStatusRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.shared.util.TextNormalizer;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentStatusService {
    private final PaymentStatusRepository repository;

    public Page<PaymentStatus> findAll(
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

    public PaymentStatus findById(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Estado de pago no encontrado: " + id
                )
            );
    }

    public PaymentStatus getStatus(String code) {

        return repository.findByCode(code)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Estado de pago no encontrado: " + code
                )
            );
    }

    public PaymentStatus create(PaymentStatusRequestDto dto) {

        String normalize =
            TextNormalizer.normalizeCode(dto.getCode());

        dto.setCode(normalize);

        if (repository.existsByCode(normalize)) {
            throw new DuplicateResourceException(
                "El estado de pago ya existe: " + normalize
            );
        }

        if (repository.existsByNameIgnoreCase(dto.getName())) {
            throw new DuplicateResourceException(
                "El nombre de estado de pago ya existe: "
                + dto.getName()
            );
        }

        PaymentStatus status = new PaymentStatus();

        status.setCode(normalize);
        status.setName(dto.getName());
        status.setDescription(dto.getDescription());

        return repository.save(status);
    }

    public PaymentStatus update(
        Integer id,
        PaymentStatusRequestDto dto
    ) {

        PaymentStatus existing = findById(id);

        if (dto.getCode() != null) {

            if (dto.getCode().isBlank()) {
                throw new IllegalArgumentException(
                    "El código de estado de pago no puede estar vacío"
                );
            }

            String normalize =
                TextNormalizer.normalizeCode(dto.getCode());

            if (
                !normalize.equals(existing.getCode())
                && repository.existsByCode(normalize)
            ) {
                throw new DuplicateResourceException(
                    "El estado de pago ya existe: " + normalize
                );
            }

            existing.setCode(normalize);
        }

        if (dto.getName() != null) {

            if (dto.getName().isBlank()) {
                throw new IllegalArgumentException(
                    "El nombre de estado de pago no puede estar vacío"
                );
            }

            if (
                !dto.getName().equalsIgnoreCase(existing.getName())
                && repository.existsByNameIgnoreCase(dto.getName())
            ) {
                throw new DuplicateResourceException(
                    "El nombre de estado de pago ya existe: "
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
                "Estado de pago no encontrado: " + id
            );
        }

        repository.deleteById(id);
    }
}
