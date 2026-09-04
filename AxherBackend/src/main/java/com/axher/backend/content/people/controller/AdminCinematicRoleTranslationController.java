package com.axher.backend.content.people.controller;

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

import com.axher.backend.content.people.Dtos.CinematicRoleAiTranslationRequestDto;
import com.axher.backend.content.people.Dtos.CinematicRoleAiTranslationResponseDto;
import com.axher.backend.content.people.Dtos.CinematicRoleTranslationDto;
import com.axher.backend.content.people.Dtos.CinematicRoleTranslationRequestDto;
import com.axher.backend.content.people.entities.CinematicRoleTranslation;
import com.axher.backend.content.people.mapper.CinematicRoleTranslationMapper;
import com.axher.backend.content.people.service.CinematicRoleTranslationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(
        "/api/admin/cinematic-roles/{roleId}/translations"
)
public class AdminCinematicRoleTranslationController {

    private final CinematicRoleTranslationService service;
    private final CinematicRoleTranslationMapper mapper;

    @GetMapping
    public ResponseEntity<List<CinematicRoleTranslationDto>> findAll(
            @PathVariable Integer roleId
    ) {

        List<CinematicRoleTranslation> translations =
                service.findByRole(roleId);

        return ResponseEntity.ok(
                translations.stream()
                        .map(mapper::toDto)
                        .toList()
        );
    }

    @PostMapping
    public ResponseEntity<CinematicRoleTranslationDto> create(
            @PathVariable Integer roleId,
            @RequestBody CinematicRoleTranslationRequestDto dto
    ) {

        CinematicRoleTranslation translation =
                service.create(roleId, dto);

        return ResponseEntity
                .status(201)
                .body(mapper.toDto(translation));
    }

    @PatchMapping("/{languageId}")
    public ResponseEntity<CinematicRoleTranslationDto> update(
            @PathVariable Integer roleId,
            @PathVariable Integer languageId,
            @RequestBody CinematicRoleTranslationRequestDto dto
    ) {

        CinematicRoleTranslation translation =
                service.update(
                        roleId,
                        languageId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(translation)
        );
    }

    @PostMapping("/{sourceLanguageId}/translate")
    public ResponseEntity<CinematicRoleAiTranslationResponseDto> translateWithAi(
            @PathVariable Integer roleId,
            @PathVariable Integer sourceLanguageId,
            @RequestBody CinematicRoleAiTranslationRequestDto dto
    ) {

        return ResponseEntity.ok(
                service.translateWithAi(
                        roleId,
                        sourceLanguageId,
                        dto
                )
        );
    }

    @DeleteMapping("/{languageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer roleId,
            @PathVariable Integer languageId
    ) {

        service.delete(
                roleId,
                languageId
        );

        return ResponseEntity.noContent().build();
    }
}
