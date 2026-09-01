package com.axher.backend.support.SupportFaq.controller;

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

import com.axher.backend.support.SupportFaq.DTOs.SupportFaqAiTranslationRequestDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqAiTranslationResponseDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqTranslationDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqTranslationRequestDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaqTranslation;
import com.axher.backend.support.SupportFaq.mapper.SupportFaqTranslationMapper;
import com.axher.backend.support.SupportFaq.service.SupportFaqTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/support/faq/{faqId}/translations")
public class AdminSupportFaqTranslationController {

    private final SupportFaqTranslationService service;
    private final SupportFaqTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<SupportFaqTranslationDto>> findAll(
        @PathVariable Integer faqId
    ) {
        List<SupportFaqTranslation> translations =
            service.findByFaq(faqId);

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
    public ResponseEntity<SupportFaqTranslationDto> create(
        @PathVariable Integer faqId,
        @RequestBody SupportFaqTranslationRequestDto dto
    ){
        SupportFaqTranslation translation = service.create(faqId, dto);

        return ResponseEntity.ok(mapper.toDto(translation));
    }

    // =============================
    // ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping("/{languageId}")
    public ResponseEntity<SupportFaqTranslationDto> update(
            @PathVariable Integer faqId,
            @PathVariable Integer languageId,
            @RequestBody SupportFaqTranslationRequestDto dto
    ) {

        SupportFaqTranslation translation =
                service.update(
                        faqId,
                        languageId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // ============================
    // TRADUCIR CON AI
    // ============================
    @PostMapping("{sourceLanguageId}/translate")
    public ResponseEntity<SupportFaqAiTranslationResponseDto> translateWithAi(
        @PathVariable Integer faqId,
        @PathVariable Integer sourceLanguageId,
        @RequestBody SupportFaqAiTranslationRequestDto dto
    ) {
        return ResponseEntity.ok(
                service.translateWithAi(
                        faqId,
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
        @PathVariable Integer faqId,
        @PathVariable Integer languageId
    ){
        service.delete(faqId, languageId);

        return ResponseEntity.noContent().build();
    }
    
}
