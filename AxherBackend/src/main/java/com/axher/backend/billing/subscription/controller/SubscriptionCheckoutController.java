package com.axher.backend.billing.subscription.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.subscription.DTOs.SubscriptionCheckoutRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.service.SubscriptionCheckoutService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionCheckoutController {

    private final SubscriptionCheckoutService service;

    // ==========================================
    // PROCESAR CHECKOUT
    // ==========================================
    @PostMapping("/checkout")
    public ResponseEntity<SubscriptionPayments> checkout(
        @RequestBody SubscriptionCheckoutRequestDto dto
    ){
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(service.checkout(dto));
    }
    
}
