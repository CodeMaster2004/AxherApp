package com.axher.backend.catalog.shelf.controllers;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.shelf.DTOs.ContentShelfDto;
import com.axher.backend.catalog.shelf.DTOs.CreateShelfDto;
import com.axher.backend.catalog.shelf.DTOs.ShelfOptionDto;
import com.axher.backend.catalog.shelf.DTOs.UpdateShelfDto;
import com.axher.backend.catalog.shelf.entities.ContentShelf;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;
import com.axher.backend.catalog.shelf.mapper.ContentShelfMapper;
import com.axher.backend.catalog.shelf.service.ContentShelfService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/shelves")
public class AdminContentShelfController {

    private final ContentShelfService service;
    private final ContentShelfMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "contentShelfId",
            "name",
            "displayOrder",
            "createdAt"
    );

    @GetMapping
    @PreAuthorize("hasAuthority('SHELF:VIEW')")
    public Page<ContentShelfDto> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "contentShelfId,desc") String sort,
            @RequestParam(required = false) ShelfTarget target
    ){

        Sort sortObj = SortUtils.parseSort(
                sort,
                ALLOWED_SORT_FIELDS,
                "contentShelfId");

        Page<ContentShelf> shelves =
                service.findAll(target, PageRequest.of(page,size,sortObj));

        return shelves.map(mapper::toDto);
    }

    @GetMapping("/{shelfId}")
    @PreAuthorize("hasAuthority('SHELF:VIEW')")
    public ResponseEntity<ContentShelfDto> findById(
            @PathVariable Integer shelfId){

        return ResponseEntity.ok(
                mapper.toDto(service.findById(shelfId))
        );
    }
    
    @GetMapping("/options")
    @PreAuthorize("hasAuthority('SHELF:VIEW')")
    public List<ShelfOptionDto> getOptions(
        @RequestParam ShelfTarget target
    ) {
        return service.getOptions(target);
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('SHELF:CREATE')")
    public ResponseEntity<ContentShelfDto> create(
            @RequestBody @Valid CreateShelfDto dto){

        ContentShelf shelf = service.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.toDto(shelf));
    }

    @PatchMapping("/{shelfId}")
    @PreAuthorize("hasAuthority('SHELF:EDIT')")
    public ResponseEntity<ContentShelfDto> update(
            @PathVariable Integer shelfId,
            @RequestBody @Valid UpdateShelfDto dto){

        ContentShelf shelf =
                service.update(shelfId,dto);

        return ResponseEntity.ok(
                mapper.toDto(shelf)
        );
    }

    @PatchMapping("/{shelfId}/toggle")
    //@PreAuthorize("hasAuthority('SHELF:EDIT')")
    public ResponseEntity<ContentShelfDto> toggleActive(
            @PathVariable Integer shelfId){

        ContentShelf shelf =
                service.toggleActive(shelfId);

        return ResponseEntity.ok(
                mapper.toDto(shelf)
        );
    }

    @DeleteMapping("/{shelfId}")
    @PreAuthorize("hasAuthority('SHELF:DELETE')")
    public ResponseEntity<Void> delete(
            @PathVariable Integer shelfId){

        service.delete(shelfId);

        return ResponseEntity.noContent().build();
    }

    
}
