package com.axher.backend.billing.subscription.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.repositories.SubscriptionPaymentsRepository;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscriptionPaymentsService {

    private final SubscriptionPaymentsRepository repository;

    // ==============================
    // LISTAR PAGOS DE LA SUSCRIPCIÓN
    // ==============================
    public List<SubscriptionPayments> findBySubscription(Subscriptions subscription){
        validateSubscriptionOwnership(subscription);
        return repository.findBySubscriptionOrderByPaymentDateDesc(subscription);
    }
    
    // ==============================
    // OBTENER PAGO DE LA SUSCRIPCIÓN
    // ==============================
    public SubscriptionPayments findById(Integer subscriptionPaymentId){

        SubscriptionPayments payment = repository
            .findById(subscriptionPaymentId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Pago de suscripción no encontrado: " + subscriptionPaymentId
                )
            );

        validateSubscriptionOwnership(payment.getSubscription());

        return payment;
    }

    // ==============================
    // BUSCAR POR ID DEL PROVEEDOR
    // ==============================
    /*
     * Este método está pensado para procesos internos,
     * especialmente para webhooks del proveedor de pagos.
     *
     * NO se valida ownership porque el proveedor externo
     * no está autenticado como un Users de nuestra aplicación.
     */
    public SubscriptionPayments findByProviderPaymentId(String providerPaymentId){

        return repository
            .findByProviderPaymentId(providerPaymentId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Pago de suscripción no encontrado: " + providerPaymentId
                )
            );
    }

    // ==============================
    // VALIDAR PROPIEDAD DE LA SUSCRIPCIÓN
    // ==============================
    public void validateSubscriptionOwnership(Subscriptions subscription){

        Users user = getCurrentUser();

        if(!subscription.getUser().getUserId().equals(user.getUserId())){
            throw new ResourceNotFoundException(
                    "Suscripción no encontrada"
            );
        }

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
