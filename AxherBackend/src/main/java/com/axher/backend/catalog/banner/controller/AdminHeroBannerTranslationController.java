package com.axher.backend.catalog.banner.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.banner.DTOs.HeroBannerTranslationDto;
import com.axher.backend.catalog.banner.DTOs.HeroBannerTranslationRequestDto;
import com.axher.backend.catalog.banner.entities.HeroBannerTranslation;
import com.axher.backend.catalog.banner.mapper.HeroBannerTranslationMapper;
import com.axher.backend.catalog.banner.service.HeroBannerTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/hero-banners/{heroBannerId}/translations")
public class AdminHeroBannerTranslationController {

    private final HeroBannerTranslationService service;
    private final HeroBannerTranslationMapper mapper;

    // =============================
    // LISTAR TRADUCCIONES
    // =============================
    @GetMapping
    public ResponseEntity<List<HeroBannerTranslationDto>> findAll(
            @PathVariable Integer heroBannerId
    ) {

        List<HeroBannerTranslation> translations =
                service.findByBanner(heroBannerId);

        return ResponseEntity.ok(
                translations.stream()
                        .map(mapper::toDto)
                        .toList()
        );
    }

    // =============================
    // CREAR / ACTUALIZAR TRADUCCIÓN
    // =============================
    @PatchMapping
    public ResponseEntity<HeroBannerTranslationDto> save(
            @PathVariable Integer heroBannerId,
            @RequestBody HeroBannerTranslationRequestDto dto
    ) {

        HeroBannerTranslation translation =
                service.save(heroBannerId, dto);

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    // =============================
    // ELIMINAR TRADUCCIÓN
    // =============================
    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer heroBannerId,
            @PathVariable Integer languageId
    ) {

        service.delete(
                heroBannerId,
                languageId
        );

        return ResponseEntity.noContent().build();
    }
}
