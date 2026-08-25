package com.axher.backend.language.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.language.DTOs.LanguageRequestDto;
import com.axher.backend.language.DTOs.LanguageResponseDto;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.mapper.LanguageMapper;
import com.axher.backend.language.service.LanguageService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/languages")
public class AdminLanguageController {

    private final LanguageService service;
    private final LanguageMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "languageId",
        "code",
        "name",
        "nativeName",
        "active"
    );

    @GetMapping
    public Page<LanguageResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "languageId,desc") String sort,
        @RequestParam(required = false) String search
    ) {

        Sort sortObj = SortUtils.parseSort(
            sort,
            ALLOWED_SORT_FIELDS,
            "languageId"
        );

        Page<Language> languagePage =
            service.findAll(
                PageRequest.of(page, size, sortObj),
                search
            );

        return languagePage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LanguageResponseDto> findById(
        @PathVariable Integer id
    ) {

        Language language = service.findById(id);

        return ResponseEntity.ok(
            mapper.toDto(language)
        );
    }


    @PostMapping
    public ResponseEntity<LanguageResponseDto> create(
        @RequestBody LanguageRequestDto dto
    ) {

        Language createdLanguage = service.create(dto);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(mapper.toDto(createdLanguage));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LanguageResponseDto> update(
        @PathVariable Integer id,
        @RequestBody LanguageRequestDto dto
    ) {

        Language updatedLanguage = service.update(id, dto);

        return ResponseEntity.ok(
            mapper.toDto(updatedLanguage)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer id
    ) {

        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}