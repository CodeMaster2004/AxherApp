package com.axher.backend.content.core.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.core.DTOs.TrendingContentDto;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.mapper.TopRatedMapper;
import com.axher.backend.content.core.mapper.TrendingMapper;
import com.axher.backend.content.core.service.PopularityService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/popularity")
public class PopularityController {

    private final PopularityService service;
    private final TrendingMapper trendingMapper;
    private final TopRatedMapper topRatedMapper;


    @GetMapping("/trending")
    @PreAuthorize("permitAll()")
    public Page<TrendingContentDto> trending(
        @RequestParam(required = false) ContentTypeEnum type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Pageable pageable = PageRequest.of(page,size);

        return service.trending(type, pageable)
                .map(trendingMapper::toDto);
    }


    @GetMapping("/top-rated")
    public List<TopRatedContentDto> topRated(
        @RequestParam(required = false) ContentTypeEnum type
    ) {
        return service.topRated(type)
                .stream()
                .map(topRatedMapper::toTopRatedDto)
                .toList();
    }

   
    
}

