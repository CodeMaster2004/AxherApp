package com.axher.backend.billing.subscription.service;


import java.time.Instant;
import java.time.LocalDate;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.repositories.PaymentStatusRepository;
import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.repositories.SubscriptionPaymentsRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionsRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionPaymentConfirmationService {
    
    private final SubscriptionPaymentsRepository paymentRepository;
    private final PaymentStatusRepository paymentStatusRepository;
    private final SubscriptionStatusRepository subscriptionStatusRepository;
    private final SubscriptionsRepository subscriptionsRepository;


    // ==============================
    // CONFIRMAR PAGO DE SUSCRIPCIÓN
    // ==============================
    public SubscriptionPayments markAsSucceded(Integer subscritpionPaymentId){

        SubscriptionPayments payment = paymentRepository.findById(subscritpionPaymentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pago de suscripcion no encontrado: " + subscritpionPaymentId
            ));

        // 1. Obtener estado PENDING
        PaymentStatus pendingStatus = paymentStatusRepository
            .findByCode("PENDING")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de pago PENDING no encontrado"
            ));
        
        // 2. Validar estado PENDING
        if(!payment.getPaymentStatus().getPaymentStatusId().equals(pendingStatus.getPaymentStatusId())){
            throw new ResourceNotFoundException(
                "El pago no está pendiente" 
            );
        }

        // 3. Obtener estado SUCCEEDED
        PaymentStatus succeededStatus = paymentStatusRepository
            .findByCode("SUCCEEDED")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de pago SUCCEEDED no encontrado"
            ));

        // 4. Confirmar pago
        payment.setPaymentStatus(succeededStatus);
        payment.setPaymentDate(Instant.now());
        return paymentRepository.save(payment);
    }

    // ==============================
    // ACTIVAR SUSCRIPCION
    // ==============================
    public Subscriptions activateSubscription(Integer subscriptionPaymentId){
        
        SubscriptionPayments payment = paymentRepository.findById(subscriptionPaymentId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Pago de suscripcion no encontrado: " + subscriptionPaymentId
            ));

        Subscriptions subscription = payment.getSubscription();

        // 1. Verificar pago confirmado
        PaymentStatus succeededStatus = paymentStatusRepository
            .findByCode("SUCCEEDED")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de pago SUCCEEDED no encontrado"
            ));

        if(!payment.getPaymentStatus().getPaymentStatusId().equals(succeededStatus.getPaymentStatusId())){
            throw new IllegalStateException(
                "No se puede activar una suscripción "
                + "con un pago no confirmado"
            );
        }

        // 2. Verificar suscripcion pendiente
        SubscriptionStatus pendingStatus = subscriptionStatusRepository
            .findByCode("PENDING_PAYMENT")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción PENDING_PAYMENT no encontrado"
            ));

        if(!subscription.getSubscriptionStatus().getSubscriptionStatusId().equals(pendingStatus.getSubscriptionStatusId())){
            throw new IllegalStateException(
                "La suscripción no está pendiente de pago"
            );
        }

        // 3. Obtener estado ACTIVE
        SubscriptionStatus activeStatus = subscriptionStatusRepository
            .findByCode("ACTIVE")
            .orElseThrow(() -> new ResourceNotFoundException(
                "Estado de suscripción ACTIVE no encontrado"
            ));

        // 4. Calcular fechas
        LocalDate startDate = LocalDate.now();

        LocalDate endDate =
            startDate.plusDays(
                subscription.getSubscriptionPlan().getDurationDays()
            );
        
        // 5. Activar suscripción
        subscription.setSubscriptionStatus(activeStatus);
        subscription.setStartDate(startDate);
        subscription.setEndDate(endDate);

        return subscriptionsRepository.save(subscription);
    }
}
