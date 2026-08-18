package com.axher.backend.billing.subscription.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.subscription.DTOs.SubscriptionRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionResponseDto;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.billing.subscription.mapper.SubscriptionMapper;
import com.axher.backend.billing.subscription.service.SubscriptionsService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscriptions")
public class SubscriptionsController {

    private final SubscriptionsService service;
    private final SubscriptionMapper mapper;

    // ==========================================
    // CREAR SUSCRIPCIÓN
    // ==========================================
    @PostMapping
    public ResponseEntity<SubscriptionResponseDto> create(
        @RequestBody SubscriptionRequestDto dto
    ){
        Subscriptions subscription = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(subscription));
    }

    // ==========================================
    // OBTENER MI SUSCRIPCIÓN POR ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDto> findById(
        @PathVariable Integer id
    ) {

        Subscriptions subscription =
            service.findById(id);

        return ResponseEntity.ok(
            mapper.toDto(subscription)
        );
    }

    // ==========================================
    // OBTENER SUSCRIPCIÓN ACTIVA DEL USUARIO
    // ==========================================
    @GetMapping("/me/active")
    public ResponseEntity<SubscriptionResponseDto> getMyActiveSubscription(){
        Subscriptions subscription = service.getMyActiveSubscription();
        return ResponseEntity.ok(mapper.toDto(subscription));
    }

    // ==========================================
    // CANCELAR SUSCRIPCION
    // ==========================================
    @PostMapping("/{id}/cancel")
    public ResponseEntity<SubscriptionResponseDto> calcel(
        @PathVariable Integer id
    ){
        Subscriptions subscription = service.cancel(id);
        return ResponseEntity.ok(mapper.toDto(subscription));
    }
    
}
