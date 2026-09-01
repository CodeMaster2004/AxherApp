package com.axher.backend.billing.subscription.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlanTranslation;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlanTranslationRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlansRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionPlansService {

    private final SubscriptionPlansRepository repository;
    private final SubscriptionPlanTranslationService translationService;
    private final SubscriptionPlanTranslationRepository translationRepository;

    public Page<SubscriptionPlans> findAll(Pageable pageable, String search) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository.search(search, pageable);   
    }

    public SubscriptionPlans findById(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Plan de suscripción no encontrado: " + id
                )
            );
    }

    public SubscriptionPlans getPlan(
        String name,
        Integer languageId
    ) {
        SubscriptionPlanTranslation translation =
            translationRepository
                .findByNameIgnoreCaseAndLanguage_LanguageId(
                    name,
                    languageId
                )
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Plan de suscripción no encontrado: " + name
                    )
                );

        return translation.getSubscriptionPlan();
    }

    public SubscriptionPlans create(SubscriptionPlanRequestDto dto) {

        if(dto.getName() == null || dto.getName().isBlank()){
            throw new IllegalArgumentException("El nombre del plan de suscripción no puede estar vacío");
        }

        if (dto.getLanguageId() == null) {
            throw new IllegalArgumentException(
                "El idioma es obligatorio"
            );
        }

        if(dto.getPrice() == null || dto.getPrice().signum() < 0){
            throw new IllegalArgumentException("El precio del plan de suscripción no puede ser negativo");
            
        }

        if(dto.getDurationDays() == null || dto.getDurationDays() <= 0){
            throw new IllegalArgumentException("La duración del plan de suscripción debe ser mayor a 0 días");
        }

        String name = dto.getName().trim();

        if (translationService.existsByNameAndLanguage(
            name,
            dto.getLanguageId()
        )) {

            throw new DuplicateResourceException(
                "El nombre ya existe en este idioma: " + name
            );
        }


        SubscriptionPlans plan = new SubscriptionPlans();

        plan.setPrice(dto.getPrice());
        plan.setDurationDays(dto.getDurationDays());

        SubscriptionPlans saved = repository.save(plan);

        SubscriptionPlanTranslationRequestDto translationDto = new SubscriptionPlanTranslationRequestDto();

        translationDto.setLanguageId(dto.getLanguageId());
        translationDto.setName(name);
        translationDto.setDescription(dto.getDescription());

        translationService.create(
            saved.getSubscriptionPlanId(),
            translationDto
        );

        return saved;
    }

    public SubscriptionPlans update(Integer id, SubscriptionPlanRequestDto dto) {
        
        SubscriptionPlans existing = findById(id);

        if(dto.getPrice() != null){

            if(dto.getPrice().signum() < 0){
                throw new IllegalArgumentException("El precio del plan de suscripción no puede ser negativo");
            }
            existing.setPrice(dto.getPrice());
        }

        if(dto.getDurationDays() != null){
            if(dto.getDurationDays() <= 0){
                throw new IllegalArgumentException("La duración del plan de suscripción debe ser mayor a 0 días");
            }
            existing.setDurationDays(dto.getDurationDays());
        }

        //==========================
        // TRADUCCIÓN
        //==========================
        if(dto.getName() != null){

            String name = dto.getName().trim();

            if (name.isBlank()) {
                throw new IllegalArgumentException(
                    "El nombre del plan de suscripción no puede estar vacío"
                );
            }

            if (dto.getLanguageId() == null) {
                throw new IllegalArgumentException(
                    "El idioma es obligatorio"
                );
            }

            if (translationService.existsByNameAndLanguageAndPlanNot(
                name,
                dto.getLanguageId(),
                id
            )) {

                throw new DuplicateResourceException(
                    "El nombre ya existe en este idioma: " + name
                );
            }

            SubscriptionPlanTranslationRequestDto translationDto = new SubscriptionPlanTranslationRequestDto();

            translationDto.setLanguageId(dto.getLanguageId());
            translationDto.setName(name);
            translationDto.setDescription(dto.getDescription());

            translationService.update(
                existing.getSubscriptionPlanId(),
                dto.getLanguageId(),    
                translationDto
            );
        }
        return repository.save(existing);
    }

    public void delete(Integer id) {
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Plan de suscripción no encontrado: " + id);
        }
        repository.deleteById(id);
    }
    
}
