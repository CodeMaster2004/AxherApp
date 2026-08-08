package com.axher.backend.catalog.shelf.controllers;

import java.util.List;

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
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.shelf.DTOs.CreateShelfContentDto;
import com.axher.backend.catalog.shelf.DTOs.ShelfContentDto;
import com.axher.backend.catalog.shelf.DTOs.UpdateShelfContentDto;
import com.axher.backend.catalog.shelf.mapper.ShelfContentMapper;
import com.axher.backend.catalog.shelf.service.ShelfContentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/shelves/{shelfId}/contents")
@RequiredArgsConstructor
public class AdminShelfContentController {

    private final ShelfContentService service;
    private final ShelfContentMapper mapper;

    @GetMapping
    public ResponseEntity<List<ShelfContentDto>> findAll(
            @PathVariable Integer shelfId
    ){

        return ResponseEntity.ok(
            service.findAllByShelf(shelfId)
                .stream()
                .map(mapper::toDto)
                .toList()
        );
    }

    @PostMapping
    //@PreAuthorize("hasAuthority('SHELF:EDIT')")
    public ResponseEntity<Void> addContent(
        @PathVariable Integer shelfId,
        @RequestBody @Valid CreateShelfContentDto dto
    ){
        service.addContent(shelfId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PatchMapping("/{shelfContentId}")
    @PreAuthorize("hasAuthority('SHELF:EDIT')")
    public ResponseEntity<Void> updatePosition(
        @PathVariable Integer shelfContentId,
        @RequestBody @Valid UpdateShelfContentDto dto
    ){
        service.updatePosition(shelfContentId, dto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{shelfContentId}")
    @PreAuthorize("hasAuthority('SHELF:EDIT')")
    public ResponseEntity<Void> delete(
        @PathVariable Integer shelfContentId
    ){
        service.delete(shelfContentId);

        return ResponseEntity.noContent().build();
    }
    
}
