package com.axher.backend.billing.payment.services;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.billing.payment.DTOs.PaymentMethodRequestDto;
import com.axher.backend.billing.payment.entities.PaymentMethods;
import com.axher.backend.billing.payment.repositories.PaymentMethodsRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;
import com.axher.backend.users.entities.Users;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentMethodsService {

    private final PaymentMethodsRepository repository;

    // ==============================
    // LISTAR MÉTODOS DEL USUARIO
    // ==============================
    public List<PaymentMethods> findAllByCurrentUser(){
        Users user = getCurrentUser();
        return repository.findByUserAndActiveTrue(user);
    }

    // ==============================
    // OBTENER MÉTODO DEL USUARIO
    // ==============================
    public PaymentMethods findByIdForCurrentUser(Integer paymentMethodId){

        Users user = getCurrentUser();

        PaymentMethods paymentMethod = repository
            .findById(paymentMethodId)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Método de pago no encontrado: " + paymentMethodId
                ));

        if(!paymentMethod.getUser().getUserId().equals(user.getUserId())){
            throw new ResourceNotFoundException(
                "Método de pago no encontrado: " + paymentMethodId
            );
        }

        if(!paymentMethod.getActive()){
            throw new ResourceNotFoundException(
                "Método de pago no encontrado: " + paymentMethodId
            );
        }

        return paymentMethod;

    }

    // ==============================
    // CREAR METODO DE PAGO
    // ==============================
    public PaymentMethods create(PaymentMethodRequestDto request){

        Users user = getCurrentUser();

        if(request.getProvider() == null || request.getProvider().isBlank()){
            throw new IllegalArgumentException("El proveedor no puede estar vacío");
        }

        if(request.getProviderPaymentMethodId() == null
            || request.getProviderPaymentMethodId().isBlank()){
            throw new IllegalArgumentException("El identificador del método de pago es obligatorio");
            
        }

        if(repository.existsByUserAndProviderAndProviderPaymentMethodId(
            user,
            request.getProvider(),
            request.getProviderPaymentMethodId()
        )){
            throw new DuplicateResourceException(
                "El método de pago ya está registrado"
            );
        }
        

        PaymentMethods paymentMethod = new PaymentMethods();

        paymentMethod.setUser(user);
        paymentMethod.setProvider(request.getProvider());
        paymentMethod.setProviderPaymentMethodId(request.getProviderPaymentMethodId());
        paymentMethod.setActive(true);
        paymentMethod.setIsDefault(
            !repository
                .findByUserAndActiveTrue(user)
                .isEmpty()
                ? false
                : true
        );

        return repository.save(paymentMethod);
    }

    // ==============================
    // ESTABLECER COMO PREDETERMINADO
    // ==============================
    public PaymentMethods setDefault(
            Integer paymentMethodId
    ) {

        PaymentMethods paymentMethod =
                findByIdForCurrentUser(paymentMethodId);

        Users user = getCurrentUser();

        List<PaymentMethods> methods =
                repository.findByUserAndActiveTrue(user);

        for (PaymentMethods method : methods) {

            method.setIsDefault(false);
        }

        paymentMethod.setIsDefault(true);

        return paymentMethod;
    }

    // ==============================
    // DESACTIVAR MÉTODO DE PAGO
    // ==============================
    public void delete(Integer paymentMethodId) {

        PaymentMethods paymentMethod =
                findByIdForCurrentUser(paymentMethodId);

        /*
         * No eliminamos físicamente el método.
         * Se desactiva para conservar integridad
         * histórica de los pagos.
         */

        paymentMethod.setActive(false);
        paymentMethod.setIsDefault(false);

        repository.save(paymentMethod);
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
