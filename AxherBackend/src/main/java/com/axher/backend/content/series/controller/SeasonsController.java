package com.axher.backend.content.series.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonResponseDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.UpcomingSeasonDto;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.mapper.SeasonMapper;
import com.axher.backend.content.series.mapper.UpcomingSeasonMapper;
import com.axher.backend.content.series.service.SeasonsService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/series/{seriesId}/seasons")
@RequiredArgsConstructor
public class SeasonsController {

    private final SeasonsService service;
    private final SeasonMapper mapper;
    private final UpcomingSeasonMapper upcomingSeasonMapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "seasonId",
        "seasonNumber",
        "title",
        "releaseDate"
    );

    /*@GetMapping("/{seasonId}")
    public ResponseEntity<SeasonResponseDto> findPublicBySeriesIdAndSeasonId(
        @PathVariable Integer seriesId,
        @PathVariable Integer seasonId
    ){
        Seasons season = service.findPublicBySeriesIdAndSeasonId(seriesId, seasonId);
        SeasonResponseDto dto = mapper.toDto(season);
        return ResponseEntity.ok(dto);
    }*/

    @GetMapping
    @PostAuthorize("permitAll()")
    public Page<SeasonResponseDto> findPublicBySeriesId(
        @PathVariable Integer seriesId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "seasonNumber,asc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "seasonNumber");
        Page<Seasons> seasonsPage = service.findPublicBySeriesId(seriesId, PageRequest.of(page,size, sortObj));
        return seasonsPage.map(mapper::toDto);
    }

    @GetMapping("/upcoming")
    public Page<UpcomingSeasonDto> upcoming(
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="10") int size
    ){
        Page<Seasons> season = service.findUpcoming(PageRequest.of(page, size));
        return season.map(upcomingSeasonMapper::toDto);
    }
    
}
