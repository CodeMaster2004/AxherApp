package com.axher.backend.language.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.language.DTOs.LanguageResponseDto;
import com.axher.backend.language.service.CurrentLanguageService;
import com.axher.backend.language.service.LanguageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/languages")
public class LanguageController {

    private final LanguageService service;
     private final CurrentLanguageService currentLanguageService;
    
    @GetMapping("/active")
    public List<LanguageResponseDto> getActiveLanguages() {
        return service.getActiveLanguages();
    }

    @GetMapping("/current")
    public Map<String, String> getCurrentLanguage() {

        return Map.of(
            "language",
            currentLanguageService.getCurrentLanguage()
        );
    }
}
