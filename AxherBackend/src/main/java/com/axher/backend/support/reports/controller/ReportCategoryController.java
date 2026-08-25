package com.axher.backend.support.reports.controller;

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
import com.axher.backend.support.reports.DTOS.ReportCategoryRequestDto;
import com.axher.backend.support.reports.DTOS.ReportCategoryResponseDto;
import com.axher.backend.support.reports.entities.ReportCategory;
import com.axher.backend.support.reports.mapper.ReportCategoryMapper;
import com.axher.backend.support.reports.service.ReportCategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/report-category")
public class ReportCategoryController {

    private final ReportCategoryService service;

    private final ReportCategoryMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "reportCategoryId",
        "code"
    );

    @GetMapping
    public Page<ReportCategoryResponseDto> findAll(

        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false) Integer languageId,
        @RequestParam(defaultValue = "reportCategoryId,desc") String sort,
        @RequestParam(required = false) String search

    ) {

        Sort sortObj =
                SortUtils.parseSort(
                        sort,
                        ALLOWED_SORT_FIELDS,
                        "reportCategoryId"
                );

        Page<ReportCategory> categoryPage =
                service.findAll(
                        PageRequest.of(
                                page,
                                size,
                                sortObj
                        ),
                        languageId,
                        search
                );

        return categoryPage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportCategoryResponseDto> findById(
            @PathVariable Integer id
    ) {

        ReportCategory category =
                service.findById(id);

        return ResponseEntity.ok(
                mapper.toDto(category)
        );
    }

    @PostMapping
    public ResponseEntity<ReportCategoryResponseDto> create(
            @RequestBody ReportCategoryRequestDto dto
    ) {

        ReportCategory createdCategory =
                service.create(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        mapper.toDto(createdCategory)
                );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ReportCategoryResponseDto> update(
            @PathVariable Integer id,
            @RequestBody ReportCategoryRequestDto dto
    ) {

        ReportCategory updatedCategory =
                service.update(id, dto);

        return ResponseEntity.ok(
                mapper.toDto(updatedCategory)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id
    ) {

        service.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}
