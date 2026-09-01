package com.axher.backend.support.SupportFaq.controller;

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
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqRequestDto;
import com.axher.backend.support.SupportFaq.DTOs.SupportFaqResponseDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;
import com.axher.backend.support.SupportFaq.mapper.SupportFaqMapper;
import com.axher.backend.support.SupportFaq.service.SupportFaqService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/support/faq")
public class AdminSupportFaqController {

    private final SupportFaqService service;
    private final SupportFaqMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "supportFaqId",
        "displayOrder",
        "active",
        "createdAt",
        "updatedAt"
    );

    // ==============================
    // LISTAR FAQS
    // ==============================
    @GetMapping
    public Page<SupportFaqResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "displayOrder,asc") String sort,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Integer supportCategoryId,
        @RequestParam(required = false) Boolean active
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "displayOrder");

        Page<SupportFaq> faqPage = service.findAll(PageRequest.of(page, size, sortObj)
            , search, supportCategoryId, active);

        return faqPage.map(mapper::toDto);
    }

    // ==============================
    // OBTENER FAQ POR ID
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<SupportFaqResponseDto> findById(@PathVariable Integer id) {

        SupportFaq faq = service.findById(id);

        return ResponseEntity.ok(mapper.toDto(faq));
    }

    // ==============================
    // CREAT FAQ
    // ==============================
    @PostMapping
    public ResponseEntity<SupportFaqResponseDto> create(
        @RequestBody SupportFaqRequestDto dto
    ){

        SupportFaq created = service.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(created));
    }

    // ==============================
    // UPDATE FAQ
    // ==============================
    @PatchMapping("/{id}")
    public ResponseEntity<SupportFaqResponseDto> update(
        @PathVariable Integer id,
        @RequestBody SupportFaqRequestDto dto
    ){
        SupportFaq updated = service.update(id, dto);

        return ResponseEntity.ok(mapper.toDto(updated));
    }

    // ==============================
    // ACTIVAR / DESACTIVAR 
    // ==============================
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<SupportFaqResponseDto> toggleActive(
        @PathVariable Integer id
    ){
        SupportFaq updated = service.toggleActive(id);

        return ResponseEntity.ok(mapper.toDto(updated));
    }

    // ==============================
    // ELIMINAR FAQ
    // ==============================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer id
    ){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
