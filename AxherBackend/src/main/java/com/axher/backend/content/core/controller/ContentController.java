package com.axher.backend.content.core.controller;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.core.DTOs.ContentDetailDto;
import com.axher.backend.content.core.DTOs.ContentFiltersDto;
import com.axher.backend.content.core.DTOs.UpcomingContentDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.mapper.ContentMapper;
import com.axher.backend.content.core.mapper.UpcomingContentMapper;
import com.axher.backend.content.core.service.ContentCatalogService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentMapper mapper;
    private final UpcomingContentMapper upcomingContentMapper;
    private final ContentCatalogService catalogService;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "contentId", "title", "price", "registeredAt", "type"
    );

    /*@GetMapping
    public Page<ContentDetailDto> findAll(
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="12") int size,
        @RequestParam(defaultValue="contentId,desc") String sort,
        @RequestParam(required=false) String search,
        @RequestParam(required=false) ContentTypeEnum type
    ){

        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentId");
        Page<Content> contents = contentService.findPublicContent(PageRequest.of(page, size, sortObj), search, type);

        return contents.map(mapper::toDto);
    }*/

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public Page<ContentDetailDto> search(
        @RequestParam (required = false) String  q,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(
            sort,
            ALLOWED_SORT_FIELDS,
            "contentId"
        );


        Page<Content> result =
            catalogService.globalSearch(
                q,
                PageRequest.of(page,size,sortObj)
            );


        return result.map(mapper::toDto);
    }

    @GetMapping("/{contentId}")
    public ContentDetailDto findById(
        @PathVariable Integer contentId
    ){

        Content content =
            catalogService.findCatalogById(contentId);

        return mapper.toDto(content);
    }

    @GetMapping("/upcoming")
    public Page<UpcomingContentDto> upcoming(
            @RequestParam(required = false) ContentTypeEnum type,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="10") int size
    ){
        Page<Content> contents = catalogService.findUpcoming(type, PageRequest.of(page, size));
        return contents.map(upcomingContentMapper::toDto);
    }

    @RequestMapping("/new")
    public Page<ContentDetailDto> newContent(
        @RequestParam(required = false) ContentTypeEnum type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Page<Content> contents = catalogService.findNewContent(type, PageRequest.of(page, size));
        return contents.map(mapper::toDto);
    }

    @GetMapping
    public Page<ContentDetailDto> findContents(
        @RequestParam(required = false) ContentTypeEnum type,
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) Integer year,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "releaseDate");
        Page<Content> contents = catalogService.filterCatalog(
            null,
            categoryId,
            year,
            null,
            null,
            type,
            PageRequest.of(page, size, sortObj)
        );

        return contents.map(mapper::toDto);
            
    }

    @GetMapping("/filters")
    public ContentFiltersDto getFilters(
        @RequestParam(required = false) ContentTypeEnum type
    ){
        
        return catalogService.getFilters(type);
    }
    
}

