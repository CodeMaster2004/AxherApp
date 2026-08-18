package com.axher.backend.billing.subscription.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPaymentResponseDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.mapper.SubscriptionPaymentMapper;
import com.axher.backend.billing.subscription.service.SubscriptionPaymentsService;
import com.axher.backend.billing.subscription.service.SubscriptionsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscription-payments")
public class SubscriptionPaymentsController {

    private final SubscriptionPaymentsService service;
    private final SubscriptionsService subscriptionsService;
    private final SubscriptionPaymentMapper mapper;

    // ==========================================
    // LISTAR PAGOS DE UNA SUSCRIPCIÓN
    // ==========================================
    @GetMapping("/{subscriptionId}/payments")
    public ResponseEntity<List<SubscriptionPaymentResponseDto>> findBySubscription(
        @PathVariable Integer subscriptionId
    ){
        Subscriptions subscrtiption = subscriptionsService.findById(subscriptionId);

        List<SubscriptionPayments> payments = service.findBySubscription(subscrtiption);
        return ResponseEntity.ok(payments.stream().map(mapper::toDto).toList());
    }

    // ==========================================
    // OBTENER PAGO DE UNA SUSCRIPCIÓN
    // ==========================================
    @GetMapping("/payments/{subscriptionPaymentId}")
    public ResponseEntity<SubscriptionPaymentResponseDto> findById(
        @PathVariable Integer subscriptionPaymentId
    ){
        SubscriptionPayments payment = service.findById(subscriptionPaymentId);
        return ResponseEntity.ok(mapper.toDto(payment));
    }
    
}
