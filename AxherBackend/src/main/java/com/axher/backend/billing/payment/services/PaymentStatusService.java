package com.axher.backend.billing.payment.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.payment.DTOs.PaymentStatusRequestDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusTranslationRequestDto;
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
    private final PaymentStatusTranslationService translationService;

    public Page<PaymentStatus> findAll(
        Pageable pageable,
        String search
    ) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository
            .search(
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
                "El estado de pago ya existe: " + normalizedCode
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

        PaymentStatus status = new PaymentStatus();
        status.setCode(normalizedCode);

        PaymentStatus saved = repository.save(status);

        PaymentStatusTranslationRequestDto translationDto =
                new PaymentStatusTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(name);
        translationDto.setDescription(dto.getDescription());

        translationService.save(
                saved.getPaymentStatusId(),
                translationDto
        );

        return saved;
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

        if(dto.getName() != null){

            String name = dto.getName().trim();

            if (name.isBlank()) {

                throw new IllegalArgumentException(
                        "El nombre del estado de pago "
                                + "no puede estar vacío"
                );
            }
            if (dto.getLanguageId() == null) {

                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService
                    .existsByNameAndLanguageAndStatusNot(
                            name,
                            dto.getLanguageId(),
                            id
                    )) {

                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: "
                                + name
                );
            }

            PaymentStatusTranslationRequestDto translationDto =
                    new PaymentStatusTranslationRequestDto();
            
            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.save(
                    existing.getPaymentStatusId(),
                    translationDto
            );
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
