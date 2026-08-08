package com.axher.backend.content.series.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.series.DTOs.seasonDTOs.CreateSeasonRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonResponseDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.UpdateSeasonRequestDto;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.mapper.SeasonMapper;
import com.axher.backend.content.series.service.SeasonsService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/series/{seriesId}/seasons")
public class AdminSeasonsController {

    private final SeasonsService service;
    private final SeasonMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "seasonId", "seasonNumber", "title", "releaseDate"
    );

    @GetMapping
    @PreAuthorize("permitAll()")
    public Page<SeasonResponseDto> findBySeriesId(
        @PathVariable Integer seriesId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "seasonNumber,asc") String sort

    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "seasonNumber");
        
        Page<Seasons> seasonsPage = service.findBySeriesId(seriesId, PageRequest.of(page,size, sortObj));

        return seasonsPage.map(mapper::toDto);
    
    }

    @GetMapping("/{seasonId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<SeasonResponseDto> findBySeasonsId(
        @PathVariable Integer seriesId,
        @PathVariable Integer seasonId
    ){
        Seasons season = service.findBySeriesIdAndSeasonId(seriesId, seasonId);
        SeasonResponseDto dto = mapper.toDto(season);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SEASON:CREATE')")
    public ResponseEntity<SeasonResponseDto> create(
        @PathVariable Integer seriesId,
        @ModelAttribute CreateSeasonRequestDto dto
    ){
        Seasons season = service.create(seriesId, dto);
        SeasonResponseDto seasonDto = mapper.toDto(season);
        return ResponseEntity.status(HttpStatus.CREATED).body(seasonDto);
    }

    @PatchMapping("/{seasonId}")
    @PreAuthorize("hasAuthority('SEASON:EDIT')")
    public ResponseEntity<SeasonResponseDto> update(
        @PathVariable Integer seriesId,
        @PathVariable Integer seasonId,
        @ModelAttribute UpdateSeasonRequestDto dto
    ){
        Seasons season = service.update(seriesId, seasonId, dto);
        SeasonResponseDto seasonDto = mapper.toDto(season);
        return ResponseEntity.ok(seasonDto);
    }

    @PatchMapping("/{seasonId}/status")
    public ResponseEntity<SeasonResponseDto> updateStatus(
        @PathVariable Integer seriesId,
        @PathVariable Integer seasonId,
        @RequestBody UpdateSeasonRequestDto dto
    ){
        Seasons season = service.updateStatus(seriesId, seasonId, dto.getStatusId());
        return ResponseEntity.ok(mapper.toDto(season));
    }

    @DeleteMapping("/{seasonId}")
    @PreAuthorize("hasAuthority('SEASON:DELETE')")
    public ResponseEntity<Void> delete(
        @PathVariable Integer seriesId,
        @PathVariable Integer seasonId
    ){
        service.delete(seriesId, seasonId);
        return ResponseEntity.noContent().build();
    }


}

