package com.axher.backend.content.core.controller;

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

import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.service.ContentCategoriesService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/categories")
public class ContentCategoriesController {
    
    private final ContentCategoriesService service;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "contentCategoryId", "name", "description"
    );

    @GetMapping
    @PreAuthorize("hasAuthority('CATEGORY:VIEW')")
    public Page<ContentCategories> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentCategoryId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentCategoryId");
        return service.findAll(
            PageRequest.of(page, size, sortObj), search
        );
    }
    

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('CATEGORY:VIEW')") // Permiso para ver categorías
    public ResponseEntity<ContentCategories> findById(@PathVariable Integer id) {
      
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('CATEGORY:CREATE')")
    public ResponseEntity<ContentCategories> create(@Valid @RequestBody ContentCategories contentCategory) {
        
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(contentCategory));
    }

   
    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('CATEGORY:EDIT')")
    public ResponseEntity<ContentCategories> update(@PathVariable Integer id, @RequestBody ContentCategories contentCategory) {
      
        return ResponseEntity.ok(service.update(id, contentCategory));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CATEGORY:DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

}
