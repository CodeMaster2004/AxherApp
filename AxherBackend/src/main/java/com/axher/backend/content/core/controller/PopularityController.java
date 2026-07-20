package com.axher.backend.content.core.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.ContentFeaturedDto;
import com.axher.backend.content.core.DTOs.PopularContentDto;
import com.axher.backend.content.core.mapper.PopularityMapper;
import com.axher.backend.content.core.service.PopularityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/popularity")
public class PopularityController {

    private final PopularityService service;
    private final PopularityMapper mapper;

    @GetMapping("/featured")
    public List<ContentFeaturedDto> featuredTrending(){
        return service.featuredTrending()
                .stream()
                .map(mapper::toFeaturedDto)
                .toList();
        
    }

    @GetMapping("/trending")
    public Page<PopularContentDto> trending(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);

        return service.trending(pageable);
    }

    @GetMapping("/movies")
    public Page<PopularContentDto> mostWatchedMovies(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);

        return service.mostWatchedMovies(pageable);
    }

    @GetMapping("/series")
    public Page<PopularContentDto> mostWatchedSeries(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page, size);

        return service.mostWatchedSeries(pageable);
    }

   
    
}

