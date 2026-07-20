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

import com.axher.backend.content.core.DTOs.ContentDetailDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.Discounts;
import com.axher.backend.content.core.mapper.ContentMapper;
import com.axher.backend.content.core.service.ContentService;
import com.axher.backend.content.core.service.DiscountsService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/discounts")
public class DiscountsController {

   private final DiscountsService service;
   private final ContentService contentService;
   private final ContentMapper contentMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "discountId", "discountType", "description"
    );

   @GetMapping
    @PreAuthorize("hasAuthority('DISCOUNT:VIEW')")
    public Page<Discounts> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "discountId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "discountId");
        return service.findAll(
            PageRequest.of(page, size, sortObj), search
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('DISCOUNT:VIEW')")
    public ResponseEntity<Discounts> findById(@PathVariable Integer id){
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('DISCOUNT:CREATE')")
    public ResponseEntity<Discounts> create(@Valid @RequestBody Discounts discount){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(discount));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('DISCOUNT:EDIT')")
    public ResponseEntity<Discounts> update(@PathVariable Integer id, @RequestBody Discounts discount){
        return ResponseEntity.ok(service.update(id, discount));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DISCOUNT:DELETE')")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    //Obtener todos los contenidos que tienen un descuento específico aplicado
    @GetMapping("/{discountId}/contents")
    public Page<ContentDetailDto> findByDiscountId(
        @PathVariable Integer discountId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,asc") String sort
    ){
        Set<String> contentAllowedFields = Set.of("contentId", "title", "price", "registeredAt", "type"); 
        Sort sortObj = SortUtils.parseSort(sort, contentAllowedFields, "contentId");
        Page<Content> contentPage = contentService.findByDiscountId(discountId, PageRequest.of(page, size, sortObj));
        return contentPage.map(contentMapper::toDto);
    }

}

