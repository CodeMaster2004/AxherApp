package com.axher.backend.billing.subscription.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanTranslationDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanTranslationRequestDto;
import com.axher.backend.billing.subscription.entities.SubscriptionPlanTranslation;
import com.axher.backend.billing.subscription.mapper.SubscriptionPlanTranslationMapper;
import com.axher.backend.billing.subscription.service.SubscriptionPlanTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
    "/api/admin/subscription-plans/{planId}/translations"
)
public class AdminSubscriptionPlanTranslationController {

    private final SubscriptionPlanTranslationService service;
    private final SubscriptionPlanTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<SubscriptionPlanTranslationDto>> findAll(
            @PathVariable Integer planId
    ) {

        List<SubscriptionPlanTranslation> translations =
                service.findByPlan(planId);

        return ResponseEntity.ok(
                translations.stream()
                        .map(mapper::toDto)
                        .toList()
        );
    }

    // =============================
    // CREAR / ACTUALIZAR
    // =============================
    @PatchMapping
    public ResponseEntity<SubscriptionPlanTranslationDto> save(
            @PathVariable Integer planId,
            @RequestBody SubscriptionPlanTranslationRequestDto dto
    ) {

        SubscriptionPlanTranslation translation =
                service.save(planId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ELIMINAR
    // =============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer planId,
            @PathVariable Integer languageId
    ) {

        service.delete(planId, languageId);

        return ResponseEntity.noContent().build();
    }
}