package com.axher.backend.billing.subscription.controller;

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

import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusAiTranslationRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusAiTranslationResponseDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusTranslationDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionStatusTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionStatusTranslation;
import com.axher.backend.billing.subscription.mapper.SubscriptionStatusTranslationMapper;
import com.axher.backend.billing.subscription.service.SubscriptionStatusTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/subscription-statuses/{subscriptionStatusId}/translations"
)
public class AdminSubscriptionStatusTranslationController {

    private final SubscriptionStatusTranslationService service;
    private final SubscriptionStatusTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================

    @GetMapping
    public ResponseEntity<List<SubscriptionStatusTranslationDto>> findAll(
            @PathVariable Integer subscriptionStatusId
    ) {

        List<SubscriptionStatusTranslation> translations =
                service.findByStatus(subscriptionStatusId);

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
    public ResponseEntity<SubscriptionStatusTranslationDto> create(
            @PathVariable Integer subscriptionStatusId,
            @RequestBody SubscriptionStatusTranslationRequestDto dto
    ) {

        SubscriptionStatusTranslation translation =
                service.create(
                        subscriptionStatusId,
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
    public ResponseEntity<SubscriptionStatusTranslationDto> update(
            @PathVariable Integer subscriptionStatusId,
            @PathVariable Integer languageId,
            @RequestBody SubscriptionStatusTranslationRequestDto dto
    ) {

        SubscriptionStatusTranslation translation =
                service.update(
                        subscriptionStatusId,
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
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<SubscriptionStatusAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer subscriptionStatusId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody SubscriptionStatusAiTranslationRequestDto dto
    ) {

        return ResponseEntity.ok(
                service.translateWithAi(
                        subscriptionStatusId,
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
            @PathVariable Integer subscriptionStatusId,
            @PathVariable Integer languageId
    ) {

        service.delete(
                subscriptionStatusId,
                languageId
        );

        return ResponseEntity.noContent().build();
    }
}