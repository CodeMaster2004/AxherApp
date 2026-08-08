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

import com.axher.backend.content.series.DTOs.EpisodesDTOs.CreateEpisodeRequestDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpdateEpisodeRequestDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.mapper.EpisodeMapper;
import com.axher.backend.content.series.service.EpisodesService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/seasons/{seasonId}/episodes")
public class AdminEpisodesController {

    private final EpisodesService service;
    private final EpisodeMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "episodeId", "episodeNumber", "title", "releaseDate", "durationMinutes"
    );

    @GetMapping
    @PreAuthorize("permitAll()")
    public Page<EpisodeResponseDto> findBySeasonId(
        @PathVariable Integer seasonId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "episodeNumber,asc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "episodeNumber");
        Page<Episodes> episodesPage = service.findBySeasonId(seasonId, PageRequest.of(page, size, sortObj));
        return episodesPage.map(mapper::toDto);
    }

    @GetMapping("/{episodeId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<EpisodeResponseDto> findBySeasonIdAndEpisodeId(
        @PathVariable Integer seasonId,
        @PathVariable Integer episodeId
    ){
        Episodes episode = service.findBySeasonIdAndEpisodeId(seasonId, episodeId);
        EpisodeResponseDto episodeDto = mapper.toDto(episode);
        return ResponseEntity.ok(episodeDto);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('EPISODE:CREATE')")
    public ResponseEntity<EpisodeResponseDto> create(
        @PathVariable Integer seasonId,
        @ModelAttribute CreateEpisodeRequestDto dto
    ){
        Episodes episode = service.create(seasonId, dto);
        EpisodeResponseDto episodeDto = mapper.toDto(episode);
        return ResponseEntity.status(HttpStatus.CREATED).body(episodeDto);
    }

    @PatchMapping("/{episodeId}")
    @PreAuthorize("hasAuthority('EPISODE:EDIT')")
    public ResponseEntity<EpisodeResponseDto> update(
        @PathVariable Integer seasonId,
        @PathVariable Integer episodeId,
        @ModelAttribute UpdateEpisodeRequestDto dto
    ){
        Episodes episode = service.update(seasonId, episodeId, dto);
        EpisodeResponseDto episodeDto = mapper.toDto(episode);
        return ResponseEntity.ok(episodeDto);
    }

    @PatchMapping("/{episodeId}/status")
    @PreAuthorize("hasAuthority('EPISODE:EDIT')")
    public ResponseEntity<EpisodeResponseDto> updateStatus(
        @PathVariable Integer seasonId,
        @PathVariable Integer episodeId,
        @RequestBody UpdateEpisodeRequestDto dto
    ){
        Episodes episode = service.updateStatus(seasonId, episodeId, dto.getStatusId());
        return ResponseEntity.ok(mapper.toDto(episode));
    }

    @DeleteMapping("/{episodeId}")
    @PreAuthorize("hasAuthority('EPISODE:DELETE')")
    public ResponseEntity<Void> delete(
        @PathVariable Integer seasonId,
        @PathVariable Integer episodeId
    ){
        service.delete(seasonId, episodeId);
        return ResponseEntity.noContent().build();
    }

    
    
}

