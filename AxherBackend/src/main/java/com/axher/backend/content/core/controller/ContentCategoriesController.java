package com.axher.backend.content.core.controller;

import com.axher.backend.content.core.mapper.CategoryMapper;
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

import com.axher.backend.content.core.DTOs.CategoryResponseDto;
import com.axher.backend.content.core.DTOs.ContentCategoryRequestDto;
import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.service.ContentCategoriesService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class ContentCategoriesController {
    
    private final CategoryMapper categoryMapper;
    private final ContentCategoriesService service;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "contentCategoryId", "name", "description"
    );


    @GetMapping
    @PreAuthorize("hasAuthority('CATEGORY:VIEW')")
    public Page<CategoryResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentCategoryId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentCategoryId");
        Page<ContentCategories> categoriesPage = service.findAll(
            PageRequest.of(page, size, sortObj), search);

        return categoriesPage.map(categoryMapper::toDto);
    }
    

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CATEGORY:VIEW')") // Permiso para ver categorías
    public ResponseEntity<CategoryResponseDto> findById(@PathVariable Integer id) {
      
        ContentCategories category = service.findById(id);
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    @GetMapping("/slug/{slug}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<CategoryResponseDto> getBySlug(@PathVariable String slug) {
        ContentCategories category = service.findBySlug(slug);
        return ResponseEntity.ok(categoryMapper.toDto(category));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CATEGORY:CREATE')")
    public ResponseEntity<CategoryResponseDto> create(@Valid @RequestBody ContentCategoryRequestDto dto) {
        
        ContentCategories createdCategory = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryMapper.toDto(createdCategory));
    }

   
    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('CATEGORY:EDIT')")
    public ResponseEntity<CategoryResponseDto> update(@PathVariable Integer id, @RequestBody ContentCategoryRequestDto dto) {
      
        ContentCategories updatedCategory = service.update(id, dto);
        return ResponseEntity.ok(categoryMapper.toDto(updatedCategory));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CATEGORY:DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
