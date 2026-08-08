package com.axher.backend.catalog.banner.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.mapper.HeroMapper;
import com.axher.backend.catalog.banner.service.HeroService;
import com.axher.backend.content.core.DTOs.HeroContentDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hero")
public class HeroController {

    private final HeroMapper heroMapper;
    private final HeroService service;

    @GetMapping
    public List<HeroContentDto> getHeroContent() {

        List<HeroBanner> banners = service.getHeroBanners();

        return banners.stream()
                .map(heroMapper::toDto)
                .toList();
    }
    
}

