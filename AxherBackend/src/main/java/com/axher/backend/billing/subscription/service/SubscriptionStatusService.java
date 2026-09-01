package com.axher.backend.billing.subscription.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusTranslationRequestDto;
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
    private final SubscriptionStatusTranslationService translationService;

    public Page<SubscriptionStatus> findAll(
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

        String normalizedCode = TextNormalizer.normalizeCode(dto.getCode());

        if (repository.existsByCode(normalizedCode)) {
            throw new DuplicateResourceException(
                    "El estado de suscripción ya existe: " + normalizedCode
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

        SubscriptionStatus status = new SubscriptionStatus();
        status.setCode(normalizedCode);

        SubscriptionStatus saved = repository.save(status);

         SubscriptionStatusTranslationRequestDto translationDto =
            new SubscriptionStatusTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(dto.getName());
        translationDto.setDescription(dto.getDescription());

        translationService.create(
            saved.getSubscriptionStatusId(),
            translationDto
        );

        return saved;
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

            String normalizedCode = TextNormalizer.normalizeCode(dto.getCode());

            if (!normalizedCode.equals(existing.getCode())
                    && repository.existsByCode(normalizedCode)) {

                throw new DuplicateResourceException(
                        "El estado de suscripción ya existe: " + normalizedCode
                );
            }

            existing.setCode(normalizedCode);
        }


        if (dto.getName() != null) {

            String name = dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                        "El nombre del estado de suscripción no puede estar vacío"
                );
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                        "El idioma es obligatorio"
                );
            }

            if (translationService.existsByNameAndLanguageAndStatusNot(
                    name,
                    dto.getLanguageId(),
                    id
            )) {

                throw new DuplicateResourceException(
                        "El nombre ya existe en este idioma: " + name
                );
            }
            SubscriptionStatusTranslationRequestDto translationDto =
                new SubscriptionStatusTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.update(
                    existing.getSubscriptionStatusId(),
                    dto.getLanguageId(),
                    translationDto
            );

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
