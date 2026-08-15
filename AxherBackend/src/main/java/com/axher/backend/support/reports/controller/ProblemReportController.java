package com.axher.backend.support.reports.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.support.reports.DTOS.ProblemReportRequestDto;
import com.axher.backend.support.reports.DTOS.ProblemReportResponseDto;
import com.axher.backend.support.reports.entities.ProblemReport;
import com.axher.backend.support.reports.mapper.ProblemReportMapper;
import com.axher.backend.support.reports.service.ProblemReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ProblemReportController {

    private final ProblemReportService service;
    private final ProblemReportMapper mapper;

    // ==============================
    // LISTAR MIS REPORTES
    // ==============================
    @GetMapping
    public Page<ProblemReportResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by("reportedAt").descending()
        );
        Page<ProblemReport> reports = service.findAllByCurrentUser(pageable);
        return reports.map(mapper::toDto);
    }

    // ==============================
    // OBTENER MI REPORTE
    // ==============================
    @GetMapping("/{reportId}")
    public ResponseEntity<ProblemReportResponseDto> findById(
        @PathVariable Integer reportId
    ){
        ProblemReport report = service.findByIdForCurrentUser(reportId);
        return ResponseEntity.ok(mapper.toDto(report));
    }

    // ==============================
    // CREAR REPORTE
    // ==============================
    @PostMapping
    public ResponseEntity<ProblemReportResponseDto> create(
        @RequestBody ProblemReportRequestDto request
    ){
        ProblemReport report = service.create(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(mapper.toDto(report));
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> delete(
        @PathVariable Integer reportId
    ){
        service.delete(reportId);
        return ResponseEntity.noContent().build();
    }
    
}
