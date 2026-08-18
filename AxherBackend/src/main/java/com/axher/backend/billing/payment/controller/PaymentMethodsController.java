package com.axher.backend.billing.payment.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.payment.DTOs.PaymentMethodRequestDto;
import com.axher.backend.billing.payment.DTOs.PaymentMethodResponseDto;
import com.axher.backend.billing.payment.entities.PaymentMethods;
import com.axher.backend.billing.payment.mapper.PaymentMethodMapper;
import com.axher.backend.billing.payment.services.PaymentMethodsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment-methods")
public class PaymentMethodsController {

    private final PaymentMethodsService service;
    private final PaymentMethodMapper mapper;

    // ==========================================
    // LISTAR MIS MÉTODOS DE PAGO
    // ==========================================
    public ResponseEntity<List<PaymentMethodResponseDto>> findAll(){
        List<PaymentMethods> paymentMethods = service.findAllByCurrentUser();
        return ResponseEntity.ok(paymentMethods.stream().map(mapper::toDto).toList());
    }

    // ==========================================
    // OBTENER MI METODO DE PAGO 
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodResponseDto> findById(
        @PathVariable Integer id
    ){
        PaymentMethods paymentMethod = service.findByIdForCurrentUser(id);
        return ResponseEntity.ok(mapper.toDto(paymentMethod));
    }

    // ==========================================
    // CREAR MÉTODO DE PAGO
    // ==========================================
    @PostMapping
    public ResponseEntity<PaymentMethodResponseDto> create(
        @RequestBody PaymentMethodRequestDto dto
    ){

        PaymentMethods paymentMethod = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(paymentMethod));
    }

    // ==========================================
    // ESTABLECER  COMO PREDERTEMINADO
    // ==========================================
    @PostMapping("/{id}/default")
    public ResponseEntity<PaymentMethodResponseDto> setDefault(
        @PathVariable Integer id
    ){
        PaymentMethods paymentMethod = service.setDefault(id);
        return ResponseEntity.ok(mapper.toDto(paymentMethod));
    }

    // ==========================================
    // DESACTIVAR MÉTODO DE PAGO
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer id
    ){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
