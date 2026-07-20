package com.axher.backend.content.core.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.HeroContentDto;
import com.axher.backend.content.core.service.HeroService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/hero")
public class HeroController {

    private final HeroService service;

    @GetMapping
    public List<HeroContentDto> getHeroContent() {
        return service.getHeroContent();
    }
    
}

