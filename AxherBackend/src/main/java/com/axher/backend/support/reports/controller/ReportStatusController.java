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
import com.axher.backend.support.reports.DTOS.ReportStatusRequestDto;
import com.axher.backend.support.reports.DTOS.ReportStatusResponseDto;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.mapper.ReportStatusMapper;
import com.axher.backend.support.reports.service.ReportStatusService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/report-status")
public class ReportStatusController {

    private final ReportStatusService service;
    private final ReportStatusMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "reportStatusId", "code", "name", "description"
    );

    @GetMapping
    public Page<ReportStatusResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "reportStatusId,desc") String sort,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) Integer languageId
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "reportStatusId");
        Page<ReportStatus> reportStatusPage = service.findAll(PageRequest.of(page, size, sortObj), languageId, search);
        return reportStatusPage.map(mapper::toDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportStatusResponseDto> findById(@PathVariable Integer id){
        ReportStatus reportStatus = service.findById(id);
        return ResponseEntity.ok(mapper.toDto(reportStatus));    
    }

    @PostMapping
    public ResponseEntity<ReportStatusResponseDto> create(
        @RequestBody ReportStatusRequestDto dto
    ){
        ReportStatus createdReportStatus = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdReportStatus));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ReportStatusResponseDto> update(
        @PathVariable Integer id,
        @RequestBody ReportStatusRequestDto dto
    ){
        ReportStatus updatedReportStatus = service.update(id, dto);
        return ResponseEntity.ok(mapper.toDto(updatedReportStatus));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}
