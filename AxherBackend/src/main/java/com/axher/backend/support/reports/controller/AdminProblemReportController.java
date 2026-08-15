package com.axher.backend.support.reports.controller;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.shared.util.SortUtils;
import com.axher.backend.support.reports.DTOS.ProblemReportResponseDto;
import com.axher.backend.support.reports.DTOS.ProblemReportStatusRequestDto;
import com.axher.backend.support.reports.entities.ProblemReport;
import com.axher.backend.support.reports.entities.ProblemReportCategory;
import com.axher.backend.support.reports.mapper.ProblemReportMapper;
import com.axher.backend.support.reports.service.ProblemReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/reports")
public class AdminProblemReportController {

    private final ProblemReportService service;
    private final ProblemReportMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "reportId",
        "category",
        "reportedAt",
        "resolvedAt"
    );

    // =============================
    // LISTAR REPORTES
    // =============================
    @GetMapping
    public Page<ProblemReportResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "reportedAt,desc") String sort,

        @RequestParam(required = false) String search,
        @RequestParam(required = false) String statusCode,
        @RequestParam(required = false) ProblemReportCategory category,
        @RequestParam(required = false) Integer userId,
        @RequestParam(required = false) Integer contentId,
        @RequestParam(required = false) Integer episodeId,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime reportedAtFrom,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        LocalDateTime reportedAtTo
    ){
        Sort sortObj = SortUtils.parseSort(
            sort,
            ALLOWED_SORT_FIELDS,
            "reportedAt"
        );

        Page<ProblemReport> reportPage = service.findAll(
            PageRequest.of(page, size, sortObj),
            search,
            statusCode,
            category,
            userId,
            contentId,
            episodeId,
            reportedAtFrom,
            reportedAtTo
        );
        return reportPage.map(mapper::toDto);
    }

    // =============================
    // OBTENER REPORTE
    // =============================
    @GetMapping("/{reportId}")
    public ResponseEntity<ProblemReportResponseDto> findById(
        @PathVariable Integer reportId
    ){
        ProblemReport report = service.findById(reportId);
        return ResponseEntity.ok(mapper.toDto(report));
    }

    // =============================
    // ACTUALIZAR ESTADO DE REPORTE
    // =============================
    @PatchMapping("/{reportId}/status")
    public ResponseEntity<ProblemReportResponseDto> updateStatus(
        @PathVariable Integer reportId,
        @RequestBody ProblemReportStatusRequestDto request
    ){
        ProblemReport report = service.updateStatus(reportId, request);
        return ResponseEntity.ok(mapper.toDto(report));
    }
    
}
