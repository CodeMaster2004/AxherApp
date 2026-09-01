package com.axher.backend.billing.payment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.payment.DTOs.PaymentStatusAiTranslationRequestDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusAiTranslationResponseDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusTranslationDto;
import com.axher.backend.billing.payment.DTOs.PaymentStatusTranslationRequestDto;
import com.axher.backend.billing.payment.entities.PaymentStatusTranslation;
import com.axher.backend.billing.payment.mapper.PaymentStatusTranslationMapper;
import com.axher.backend.billing.payment.services.PaymentStatusTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/payment-statuses/{paymentStatusId}/translations"
)
public class AdminPaymentStatusTranslationController {

    private final PaymentStatusTranslationService service;

    private final PaymentStatusTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<PaymentStatusTranslationDto>> findAll(
            @PathVariable Integer paymentStatusId
    ) {

        List<PaymentStatusTranslation> translations =
                service.findByStatus(paymentStatusId);

        return ResponseEntity.ok(
                translations.stream()
                        .map(mapper::toDto)
                        .toList()
        );
    }

    // =============================
    // CREAR TRADUCCIÓN
    // =============================
    @PostMapping
    public ResponseEntity<PaymentStatusTranslationDto> create(
            @PathVariable Integer paymentStatusId,
            @RequestBody PaymentStatusTranslationRequestDto dto
    ) {

        PaymentStatusTranslation translation =
                service.create(
                        paymentStatusId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<PaymentStatusTranslationDto> update(
            @PathVariable Integer paymentStatusId,
            @PathVariable Integer languageId,
            @RequestBody PaymentStatusTranslationRequestDto dto
    ) {
        
        PaymentStatusTranslation translation =
                service.update(
                        paymentStatusId,
                        languageId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // TRADUCIR CON AI
    // =============================
    public ResponseEntity<PaymentStatusAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer paymentStatusId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody PaymentStatusAiTranslationRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.translateWithAi(
                        paymentStatusId,
                        sourceLanguageId,
                        dto
                )
        );
    }

    // =============================
    // ELIMINAR TRADUCCIÓN
    // =============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer paymentStatusId,
            @PathVariable Integer languageId
    ) {

        service.delete(
                paymentStatusId,
                languageId
        );

        return ResponseEntity.noContent().build();
    }
}
