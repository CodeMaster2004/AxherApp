package com.axher.backend.billing.subscription.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlansRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionPlansService {

    private final SubscriptionPlansRepository repository;

    public Page<SubscriptionPlans> findAll(Pageable pageable, String search) {

        if (search == null || search.isBlank()) {
            return repository.findAll(pageable);
        }

        return repository.findByNameContainingIgnoreCase(search, pageable);   
    }

    public SubscriptionPlans findById(Integer id) {

        return repository.findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Plan de suscripción no encontrado: " + id
                )
            );
    }

    public SubscriptionPlans getPlan(String name) {

        return repository.findByNameIgnoreCase(name)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Plan de suscripción no encontrado: " + name
                )
            );
    }

    public SubscriptionPlans create(SubscriptionPlanRequestDto dto) {

        if(dto.getName() == null || dto.getName().isBlank()){
            throw new IllegalArgumentException("El nombre del plan de suscripción no puede estar vacío");
        }

        if(dto.getPrice() == null || dto.getPrice().signum() < 0){
            throw new IllegalArgumentException("El precio del plan de suscripción no puede ser negativo");
            
        }

        if(dto.getDurationDays() == null || dto.getDurationDays() <= 0){
            throw new IllegalArgumentException("La duración del plan de suscripción debe ser mayor a 0 días");
        }

        if(repository.existsByNameIgnoreCase(dto.getName())){
            throw new IllegalArgumentException("El nombre del plan de suscripción ya existe: " + dto.getName());
        }

        SubscriptionPlans plan = new SubscriptionPlans();

        plan.setName(dto.getName());
        plan.setPrice(dto.getPrice());
        plan.setDescription(dto.getDescription());
        plan.setDurationDays(dto.getDurationDays());

        return repository.save(plan);
    }

    public SubscriptionPlans update(Integer id, SubscriptionPlanRequestDto dto) {
        
        SubscriptionPlans existing = findById(id);

        if(dto.getName() != null){
            if(dto.getName().isBlank()){
                throw new IllegalArgumentException("El nombre del plan de suscripción no puede estar vacío");
            }

            if(!dto.getName().equalsIgnoreCase(existing.getName())
            && repository.existsByNameIgnoreCase(dto.getName())){
                throw new IllegalArgumentException("El nombre del plan de suscripción ya existe: " + dto.getName());
            }
            existing.setName(dto.getName());
        }

        if(dto.getPrice() != null){

            if(dto.getPrice().signum() < 0){
                throw new IllegalArgumentException("El precio del plan de suscripción no puede ser negativo");
            }
            existing.setPrice(dto.getPrice());
        }

        if(dto.getDescription() != null){
            existing.setDescription(dto.getDescription());
        }

        if(dto.getDurationDays() != null){
            if(dto.getDurationDays() <= 0){
                throw new IllegalArgumentException("La duración del plan de suscripción debe ser mayor a 0 días");
            }
            existing.setDurationDays(dto.getDurationDays());
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
