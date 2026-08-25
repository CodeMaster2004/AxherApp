package com.axher.backend.content.core.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.ContentTranslationDto;
import com.axher.backend.content.core.entities.ContentTranslation;
import com.axher.backend.content.core.service.ContentTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/content")
public class ContentTranslationController {

    private final ContentTranslationService contentTranslationService;

    @GetMapping("/{contentId}/translations/{languageCode}")
    public ResponseEntity<ContentTranslationDto> findTranslation(
        @PathVariable Integer contentId,
        @PathVariable String languageCode
    ){
        ContentTranslation translation = contentTranslationService.findByContentAndLanguage(
            contentId,
            languageCode
        ).orElse(null);

        ContentTranslationDto translationDto = new ContentTranslationDto(
            translation.getContent().getContentId(),
            translation.getLanguage().getLanguageId(),
            translation.getLanguage().getCode(),
            translation.getLanguage().getName(),
            translation.getTitle(),
            translation.getDescription()
        );

        return ResponseEntity.ok(translationDto);
    }

    
    
}
