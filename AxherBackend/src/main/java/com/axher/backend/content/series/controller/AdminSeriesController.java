package com.axher.backend.content.series.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.series.DTOs.SeriesDTOs.SeriesDetailResponseDto;
import com.axher.backend.content.series.entities.Series;
import com.axher.backend.content.series.mapper.SeriesMapper;
import com.axher.backend.content.series.service.SeriesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/series")
public class AdminSeriesController {

    private final SeriesService service;
    private final SeriesMapper seriesMapper;
    
    @GetMapping("/{contentId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<SeriesDetailResponseDto> findSeriesDetail(@PathVariable Integer contentId){
        Series series = service.findByContentId(contentId);
        SeriesDetailResponseDto dto = seriesMapper.toDto(series);
        return ResponseEntity.ok(dto);
    }
    
}
