package com.axher.backend.catalog.page.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.page.DTOs.PageSectionDto;
import com.axher.backend.catalog.page.entities.PageType;
import com.axher.backend.catalog.page.service.PageSectionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/pages")
@RequiredArgsConstructor
public class PageSectionController {

    private final PageSectionService service;

    @GetMapping("/{page}/sections")
    public List<PageSectionDto> getPageSections(
        @PathVariable PageType page
    ){
        return service.getPageSection(page);
    }

    
}
