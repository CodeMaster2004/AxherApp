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

import com.axher.backend.content.people.Dtos.CinematicRoleRequestDto;
import com.axher.backend.content.people.Dtos.CinematicRoleResponseDto;
import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.mapper.CinematicRoleMapper;
import com.axher.backend.content.people.service.CinematicRoleService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/cinematic-roles")
public class AdminCinematicRoleController {

    private final CinematicRoleService service;
    private final CinematicRoleMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "cinematicRoleId",
            "code",
            "name",
            "description"
    );

    @GetMapping
    public Page<CinematicRoleResponseDto> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer languageId,
            @RequestParam(defaultValue = "cinematicRoleId,asc") String sort,
            @RequestParam(required = false) String search
    ) {

        Sort sortObj = SortUtils.parseSort(
                sort,
                ALLOWED_SORT_FIELDS,
                "cinematicRoleId"
        );

        Page<CinematicRole> rolePage =
                service.findAll(
                        PageRequest.of(page, size, sortObj),
                        languageId,
                        search
                );

        return rolePage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CinematicRoleResponseDto> findById(
            @PathVariable Integer id
    ) {

        CinematicRole role = service.findById(id);

        return ResponseEntity.ok(
                mapper.toDto(role)
        );
    }

    @PostMapping
    public ResponseEntity<CinematicRoleResponseDto> create(
            @RequestBody CinematicRoleRequestDto dto
    ) {

        CinematicRole created =
                service.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.toDto(created));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CinematicRoleResponseDto> update(
            @PathVariable Integer id,
            @RequestBody CinematicRoleRequestDto dto
    ) {

        CinematicRole updated =
                service.update(id, dto);

        return ResponseEntity.ok(
                mapper.toDto(updated)
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
