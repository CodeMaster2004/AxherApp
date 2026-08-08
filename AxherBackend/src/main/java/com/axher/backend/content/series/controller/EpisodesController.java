package com.axher.backend.content.series.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpcomingEpisodeDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.mapper.EpisodeMapper;
import com.axher.backend.content.series.mapper.UpcomingEpisodeMapper;
import com.axher.backend.content.series.service.EpisodesService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seasons/{seasonId}/episodes")
@RequiredArgsConstructor
public class EpisodesController {

    private final EpisodesService service;
    private final UpcomingEpisodeMapper upcomingEpisodeMapper;
    private final EpisodeMapper mapper;

    /*@GetMapping("/{episodeId}")
    public ResponseEntity<EpisodeResponseDto> findPublicBySeasonIdAndEpisodeId(
        @PathVariable Integer seasonId,
        @PathVariable Integer episodeId
    ){
        Episodes episode = service.findPublicBySeasonIdAndEpisodeId(seasonId, episodeId);
        EpisodeResponseDto dto = mapper.toDto(episode);
        return ResponseEntity.ok(dto);
    }*/
   private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "episodeId",
        "episodeNumber",
        "title",
        "releaseDate",
        "durationSeconds"
    );

    @GetMapping
    public Page<EpisodeResponseDto> findPublicBySeasonId(
        @PathVariable Integer seasonId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "episodeNumber,asc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "episodeNumber");
        Page<Episodes> episodesPage = service.findPublicBySeasonId(seasonId, PageRequest.of(page, size, sortObj));
        return episodesPage.map(mapper::toDto);
    }
    
    @GetMapping("/upcoming")
    public Page<UpcomingEpisodeDto> upcoming(
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="10") int size
    ){
        Page<Episodes> episodes = service.findUpcoming(PageRequest.of(page, size));
        return episodes.map(upcomingEpisodeMapper::toDto);
    }
    
}
