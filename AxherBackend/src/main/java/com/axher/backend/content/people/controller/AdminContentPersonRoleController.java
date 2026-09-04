package com.axher.backend.content.people.controller;

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

import com.axher.backend.content.people.Dtos.ContentPersonRoleCreateDto;
import com.axher.backend.content.people.Dtos.ContentPersonRoleResponseDto;
import com.axher.backend.content.people.Dtos.ContentPersonRoleUpdateDto;
import com.axher.backend.content.people.entities.ContentPersonRole;
import com.axher.backend.content.people.mapper.ContentPersonRoleMapper;
import com.axher.backend.content.people.service.ContentPersonRoleService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/contents/{contentId}/people")
public class AdminContentPersonRoleController {

    private final ContentPersonRoleService service;
    private final ContentPersonRoleMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "contentPersonRoleId",
            "orderIndex"
    );

    // ==============================
    // OBTENER REPARTO Y EQUIPO
    // ==============================
    @GetMapping
    public Page<ContentPersonRoleResponseDto> findByContent(
            @PathVariable Integer contentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "orderIndex,asc") String sort,
            @RequestParam(required = false) String search
    ) {

        Sort sortObj = SortUtils.parseSort(
                sort,
                ALLOWED_SORT_FIELDS,
                "orderIndex"
        );

        Page<ContentPersonRole> rolePage =
                service.findByContent(
                        contentId,
                        PageRequest.of(page, size, sortObj),
                        search
                );

        return rolePage.map(mapper::toDto);
    }

    // ==============================
    // OBTENER POR ID
    // ==============================
    @GetMapping("/{contentPersonRoleId}")
    public ResponseEntity<ContentPersonRoleResponseDto> getById(
            @PathVariable Integer contentId,
            @PathVariable Long contentPersonRoleId
    ) {

        ContentPersonRole contentPersonRole =
                service.getById(
                        contentId,
                        contentPersonRoleId
                );

        return ResponseEntity.ok(
                mapper.toDto(contentPersonRole)
        );
    }

    // ==============================
    // CREAR
    // ==============================
    @PostMapping
    public ResponseEntity<ContentPersonRoleResponseDto> create(
            @PathVariable Integer contentId,
            @RequestBody ContentPersonRoleCreateDto dto
    ) {

        ContentPersonRole created =
                service.create(
                        contentId,
                        dto
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        mapper.toDto(created)
                );
    }

    // ==============================
    // ACTUALIZAR
    // ==============================
    @PatchMapping("/{contentPersonRoleId}")
    public ResponseEntity<ContentPersonRoleResponseDto> update(
            @PathVariable Integer contentId,
            @PathVariable Long contentPersonRoleId,
            @RequestBody ContentPersonRoleUpdateDto dto

    ) {

        ContentPersonRole updated =
                service.update(
                        contentId,
                        contentPersonRoleId,
                        dto
                );

        return ResponseEntity.ok(
                mapper.toDto(updated)
        );
    }

    // ==============================
    // ELIMINAR
    // ==============================
    @DeleteMapping("/{contentPersonRoleId}")
    public ResponseEntity<Void> delete(

            @PathVariable Integer contentId,

            @PathVariable Long contentPersonRoleId

    ) {

        service.delete(
                contentId,
                contentPersonRoleId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}