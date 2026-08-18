package com.axher.backend.billing.subscription.service;


import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.DTOs.SubscriptionRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.repositories.SubscriptionPlansRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionsRepository;
import com.axher.backend.content.core.entities.Discounts;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionsService {

    private final SubscriptionsRepository repository;
    private final SubscriptionPlansRepository subscriptionPlansRepository;
    private final SubscriptionStatusRepository subscriptionStatusRepository;
    //private final DiscountsRepository discountsRepository;
    

    // ==============================
    // CREAR SUSCRIPCIÓN
    // ==============================
    public Subscriptions create(SubscriptionRequestDto dto){
        
        Users user = getCurrentUser();

        // 1. Obtener plan
        SubscriptionPlans plan = subscriptionPlansRepository
            .findById(dto.getSubscriptionPlanId())
            .orElseThrow(() -> new ResourceNotFoundException(
                "Plan de suscripción no encontrado"
            ));
        
        // 2. Obtener estado PENDING_PAYMENT
        SubscriptionStatus pendingPayment = subscriptionStatusRepository
            .findByCode("PENDING_PAYMENT")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción PENDING_PAYMENT no encontrado"
            ));

        // 3. Verificar suscripción pendiente existente
        if(repository.existsByUserAndSubscriptionStatus(user, pendingPayment)){
            throw new DuplicateResourceException(
                "El usuario ya tiene una suscripción pendiente de pago"
            );
        }

        // 4. Obtener estado ACTIVE
        SubscriptionStatus active = subscriptionStatusRepository
            .findByCode("ACTIVE")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción ACTIVE no encontrado"
            ));

        // 5. Verificar suscripción activa existente
        if(repository.existsByUserAndSubscriptionStatus(user, active)){
            throw new DuplicateResourceException(
                "El usuario ya tiene una suscripción activa"
            );
        }

        
        // 6. Crear suscripción
        Discounts discount = null;

        Subscriptions subscription = new Subscriptions();
        subscription.setUser(user);
        subscription.setSubscriptionPlan(plan);
        subscription.setStartDate(null);
        subscription.setEndDate(null);
        subscription.setDiscount(discount);
        subscription.setSubscriptionStatus(pendingPayment);

        return repository.save(subscription);
    }

    // ==============================
    // BUSCAR POR ID
    // ==============================
    public Subscriptions findById(Integer id){
        Users user = getCurrentUser();

        Subscriptions subscription = repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Suscripción no encontrada: " + id
            ));

        // La suscripción pertenece al usuario autenticado
        if(!subscription.getUser().getUserId().equals(user.getUserId())){
            throw new ResourceNotFoundException(
                "Suscripción no encontrada: " + id
            );
        }

        return subscription;
    }

    // ==============================
    // MI SUSCRIPCIÓN ACTIVA
    // ==============================
    public Subscriptions getMyActiveSubscription() {

        Users user = getCurrentUser();

        SubscriptionStatus activeStatus = subscriptionStatusRepository
            .findByCode("ACTIVE")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción ACTIVE no encontrado"
            ));

        return repository.findByUserAndSubscriptionStatus(user, activeStatus)
            .orElseThrow(() -> new ResourceNotFoundException(
                "No se encontró una suscripción activa para el usuario"
            ));
    }

    // ==============================
    // CANCELAR SUSCRIPCIÓN
    // ==============================
    public Subscriptions cancel(Integer id){
        Subscriptions subscription = findById(id);

        // 1. Obtener el estado activo
        SubscriptionStatus activeStatus = subscriptionStatusRepository
            .findByCode("ACTIVE")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción ACTIVE no encontrado"
            ));

        // 2. Verificar que esté activa
        if(!subscription.getSubscriptionStatus()
                .getSubscriptionStatusId()
                .equals(activeStatus.getSubscriptionStatusId())){
            throw new IllegalArgumentException(
                "Solo se puede cancelar una suscripción activa"
            );
        }

        // 3. Obtener estado CANCELLED
        SubscriptionStatus canceledStatus = subscriptionStatusRepository
            .findByCode("CANCELLED")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción CANCELLED no encontrado"
            ));

        // 4. Cancelar
        subscription.setSubscriptionStatus(canceledStatus);

        return repository.save(subscription);
    }



    // ==============================
    // USUARIO AUTENTICADO
    // ==============================
    private Users getCurrentUser() {
        return (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }
    
}
