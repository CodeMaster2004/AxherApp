package com.axher.backend.catalog.banner.controller;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.banner.DTOs.HeroBannerDto;
import com.axher.backend.catalog.banner.DTOs.HeroBannerRequestDto;
import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.mapper.HeroBannerMapper;
import com.axher.backend.catalog.banner.service.HeroBannerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/hero")
public class AdminHeroBannerController {
    private final HeroBannerService service;
    private final HeroBannerMapper mapper;

        @GetMapping
        //@PreAuthorize("hasAuthority('BANNER:VIEW')")
        public ResponseEntity<Page<HeroBannerDto>> findAll(
                @RequestParam(required = false) String search,
                Pageable pageable
        ){

        Page<HeroBannerDto> banners = service.findAll(search, pageable)
                .map(mapper::toDto);

        return ResponseEntity.ok(banners);
        }

    @GetMapping("/{bannerId}")
    //@PreAuthorize("hasAuthority('BANNER:VIEW')")
    public ResponseEntity<HeroBannerDto> findById(
            @PathVariable Integer bannerId){

        HeroBanner banner = service.findById(bannerId);

        return ResponseEntity.ok(
                mapper.toDto(banner)
        );
    }

    @PostMapping
    //@PreAuthorize("hasAuthority('BANNER:CREATE')")
    public ResponseEntity<HeroBannerDto> create(
            @ModelAttribute HeroBannerRequestDto dto){

        HeroBanner banner = service.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    mapper.toDto(banner)
                );
    }

    @PatchMapping("/{bannerId}")
    //@PreAuthorize("hasAuthority('BANNER:EDIT')")
    public ResponseEntity<HeroBannerDto> update(
            @PathVariable Integer bannerId,
            @ModelAttribute HeroBannerRequestDto dto){

        HeroBanner banner =
                service.update(bannerId, dto);

        return ResponseEntity.ok(
                mapper.toDto(banner)
        );
    }

    @PatchMapping("/{bannerId}/toggle")
    //@PreAuthorize("hasAuthority('BANNER:EDIT')")
    public ResponseEntity<HeroBannerDto> toggleActive(
            @PathVariable Integer bannerId){

        HeroBanner banner =
                service.toggleActive(bannerId);

        return ResponseEntity.ok(
                mapper.toDto(banner)
        );
    }

    @DeleteMapping("/{bannerId}")
    //@PreAuthorize("hasAuthority('BANNER:DELETE')")
    public ResponseEntity<Void> delete(
            @PathVariable Integer bannerId){

        service.delete(bannerId);

        return ResponseEntity.noContent().build();
    }
}
