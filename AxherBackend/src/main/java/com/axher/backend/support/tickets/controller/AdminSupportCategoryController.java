package com.axher.backend.support.tickets.controller;

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

import com.axher.backend.shared.util.SortUtils;
import com.axher.backend.support.tickets.DTOs.SupportCategoryRequestDto;
import com.axher.backend.support.tickets.DTOs.SupportCategoryResponseDto;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.mapper.SupportCategoryMapper;
import com.axher.backend.support.tickets.service.SupportCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/support/ticket-category")
public class AdminSupportCategoryController {

    private final SupportCategoryService service;
    private final SupportCategoryMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "supportCategoryId", "code", "name", "description"
    );

    @GetMapping
    public Page<SupportCategoryResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "supportCategoryId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "supportCategoryId");
        Page<SupportCategory> supportCategoryPage = service.findAll(PageRequest.of(page, size, sortObj), search);
        return supportCategoryPage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportCategoryResponseDto> findById(@PathVariable Integer id){
        SupportCategory supportCategory = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(supportCategory));    
    }

    @PostMapping
    public ResponseEntity<SupportCategoryResponseDto> create(
        @RequestBody SupportCategoryRequestDto dto
    ){
        SupportCategory createdSupportCategory = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdSupportCategory));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SupportCategoryResponseDto> update(
        @PathVariable Integer id,
        @RequestBody SupportCategoryRequestDto dto
    ){
        SupportCategory updatedSupportCategory = service.update(id, dto);
        return ResponseEntity.ok(mapper.toDto(updatedSupportCategory));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
