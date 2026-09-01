package com.axher.backend.support.SupportFaq.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.SupportFaq.DTOs.SupportFaqResponseDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;
import com.axher.backend.support.SupportFaq.mapper.SupportFaqMapper;
import com.axher.backend.support.SupportFaq.service.SupportFaqService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/support/faq")
public class SupportFaqController {

    private final SupportFaqService service;
    private final SupportFaqMapper mapper;


    // ==============================
    // LISTAR FAQS ACTIVAS  
    // ==============================
    @GetMapping
    public Page<SupportFaqResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Integer supportCategoryId
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayOrder").ascending());

        Page<SupportFaq> faqPage = service.findAll(pageable, search, supportCategoryId, true);

        return faqPage.map(mapper::toDto);
    }

    // ==============================
    // OBTENER FAQ  ACTIVA
    // ==============================
    @GetMapping("/{id}")
    public ResponseEntity<SupportFaqResponseDto> findById(@PathVariable Integer id) {

        SupportFaq faq = service.findActiveById(id);

        return ResponseEntity.ok( mapper.toDto(faq) );
    }
    
}
