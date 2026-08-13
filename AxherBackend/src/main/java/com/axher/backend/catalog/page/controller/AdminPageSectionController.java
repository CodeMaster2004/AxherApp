package com.axher.backend.catalog.page.controller;

import java.util.List;

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

import com.axher.backend.catalog.page.DTOs.PageSectionCreateDto;
import com.axher.backend.catalog.page.DTOs.PageSectionDto;
import com.axher.backend.catalog.page.DTOs.PageSectionUpdateDto;
import com.axher.backend.catalog.page.entities.PageSection;
import com.axher.backend.catalog.page.entities.PageType;
import com.axher.backend.catalog.page.mapper.PageSectionMapper;
import com.axher.backend.catalog.page.service.PageSectionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/pages")
@RequiredArgsConstructor
public class AdminPageSectionController {

    private final PageSectionService service;
    private final PageSectionMapper mapper;

    @GetMapping
    public ResponseEntity<List<PageSectionDto>> getAllByPage(
        @RequestParam PageType page
    ){
        return ResponseEntity.ok(service.getAllByPage(page));
    }
    

    @GetMapping("/section/{id}")
    public PageSectionDto getByid(
        @PathVariable Integer id
    ){
        return service.getById(id);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<PageSectionDto> toggleActive(
            @PathVariable Integer id
    ) {

        PageSection section =
                service.toggleActive(id);

        return ResponseEntity.ok(
            mapper.toDto(section)
        );
    }

    @PostMapping
    public PageSectionDto create(
        @RequestBody PageSectionCreateDto request
    ){
        return service.create(request);
    }

    @PatchMapping("/{id}")
    public PageSectionDto update(
        @PathVariable Integer id,
        @RequestBody PageSectionUpdateDto request
    ){
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
    
}
