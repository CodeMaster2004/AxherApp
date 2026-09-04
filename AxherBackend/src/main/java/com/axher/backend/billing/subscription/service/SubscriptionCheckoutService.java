package com.axher.backend.billing.subscription.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.payment.entities.PaymentMethods;
import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.repositories.PaymentMethodsRepository;
import com.axher.backend.billing.payment.repositories.PaymentStatusRepository;
import com.axher.backend.billing.subscription.DTOs.SubscriptionCheckoutRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.repositories.SubscriptionPaymentsRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionStatusRepository;
import com.axher.backend.billing.subscription.repositories.SubscriptionsRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionCheckoutService {

    private final SubscriptionsRepository subscriptionsRepository;
    private final SubscriptionPaymentsRepository subscriptionPaymentsRepository;
    private final SubscriptionStatusRepository subscriptionStatusRepository;

    private final PaymentMethodsRepository paymentMethodsRepository;
    private final PaymentStatusRepository paymentStatusRepository;

    // ==============================
    // PROCESAR CHECKOUT DE SUSCRIPCIÓN
    // ==============================
    public SubscriptionPayments checkout(SubscriptionCheckoutRequestDto dto){

        Users user = getCurrentUser();

        //1. Obtener la suscripción
        Subscriptions subscription =
            subscriptionsRepository.findById(dto.getSubscriptionId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Suscripcion no encontrada"
                    ));
        // 2. Validar propietario
        if(!subscription.getUser().getUserId().equals(user.getUserId())){
            throw new ResourceNotFoundException(
                "Suscripcion no encontrada"
            );
        }

        // 3. Validar estado de suscripcion
        SubscriptionStatus pendingPayment = 
            subscriptionStatusRepository
                .findByCode("PENDING_PAYMENT")
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Estado PENDING_PAYMENT no encontrado"
                    ));
        if(!subscription.getSubscriptionStatus()
                .getSubscriptionStatusId()
                .equals(pendingPayment.getSubscriptionStatusId()) 
        ){
            throw new IllegalStateException(
                "La suscripción no está pendiente de pago"
            );
        }

        // 4. Obtener método de pago
        PaymentMethods paymentMethod = 
            paymentMethodsRepository.findById(dto.getPaymentMethodId())
            .orElseThrow(() -> 
                new ResourceNotFoundException(
                    "Método de pago no encontrado"
                ));
        
        // 5. Validar propietario del método de pago
        if(!paymentMethod.getUser()
            .getUserId()
            .equals(user.getUserId())
        ){
            throw new ResourceNotFoundException(
                "Método de pago no encontrado"
            );
        }

        // 6. Validar método activo
        if(!paymentMethod.getActive()){
            throw new ResourceNotFoundException(
                "Método de pago no está activo"
            );
        }

        // 7. Obtener plan
        SubscriptionPlans plan = subscription.getSubscriptionPlan();

        BigDecimal amount = plan.getPrice();

        // 8. Obtener estado PENDING
        PaymentStatus paymentStatus = 
            paymentStatusRepository
                .findByCode("PENDING")
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Estado de pago PENDING no encontrado"
                    ));

        // 9. Verificar que no exista otro pago pendiente
        Optional<SubscriptionPayments> existingPayment =
            subscriptionPaymentsRepository
                .findBySubscriptionAndPaymentStatus(
                    subscription,
                    paymentStatus
                );

        if (existingPayment.isPresent()) {
            throw new IllegalStateException(
                "La suscripción ya tiene un pago pendiente"
            );
        }

        // 8. Crear pago
        SubscriptionPayments payment = new SubscriptionPayments();

        payment.setSubscription(subscription);
        payment.setAmount(amount);
        payment.setPaymentDate(null);
        payment.setPaymentMethod(paymentMethod);
        payment.setPaymentStatus(paymentStatus);
        payment.setCreatedAt(Instant.now());

        /*
         * Temporalmente utilizamos un identificador interno.
         *
         * Posteriormente este valor será proporcionado
         * por Stripe, Mercado Pago, etc.
         */
        payment.setProviderPaymentId(
            "PENDING-" + System.currentTimeMillis()
        );
        return subscriptionPaymentsRepository.save(payment);

    }

    

    // ==========================================
    // USUARIO AUTENTICADO
    // ==========================================
    private Users getCurrentUser() {

        return (Users) SecurityContextHolder
            .getContext()
            .getAuthentication()
            .getPrincipal();
    }
    
}
