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

import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanAiTranslationRequestDto;
import com.axher.backend.billing.subscription.DTOs.SubscriptionPlanAiTranslationResponseDto;
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
    // CREAR 
    // =============================
    @PostMapping
    public ResponseEntity<SubscriptionPlanTranslationDto> create(
            @PathVariable Integer planId,
            @RequestBody SubscriptionPlanTranslationRequestDto dto
    ) {

        SubscriptionPlanTranslation translation =
                service.create(planId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<SubscriptionPlanTranslationDto> update(
            @PathVariable Integer planId,
            @PathVariable Integer languageId,
            @RequestBody SubscriptionPlanTranslationRequestDto dto
    ) {

        SubscriptionPlanTranslation translation =
                service.update(planId, languageId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // TRADUCIR CON AI
    // =============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<SubscriptionPlanAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer planId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody SubscriptionPlanAiTranslationRequestDto dto
    ) {
            return ResponseEntity.ok(
                    service.translateWithAi(
                            planId,
                            sourceLanguageId,
                            dto
                    )
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