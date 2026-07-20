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
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.mapper.ContentMapper;
import com.axher.backend.content.core.service.ContentService;
import com.axher.backend.shared.util.SortUtils;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/public/contents")
@RequiredArgsConstructor
public class PublicContentController {

    private final ContentService contentService;
    private final ContentMapper mapper;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "contentId", "title", "price", "registeredAt", "type"
    );

    @GetMapping
    public Page<ContentDetailDto> findAll(
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="12") int size,
        @RequestParam(defaultValue="contentId,desc") String sort,
        @RequestParam(required=false) String search
    ){

        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "contentId");
        Page<Content> contents = contentService.findPublicContent(PageRequest.of(page, size, sortObj), search);

        return contents.map(mapper::toDto);
    }

    @GetMapping("/search")
    @PreAuthorize("permitAll()")
    public Page<ContentDetailDto> search(
        @RequestParam(required = false) String title,
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) ContentTypeEnum type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(
            sort,
            ALLOWED_SORT_FIELDS,
            "contentId"
        );


        Page<Content> contentPage =
            contentService.searchPublicContents(
                title,
                categoryId,
                type,
                PageRequest.of(page,size,sortObj)
            );


        return contentPage.map(mapper::toDto);
    }

    @GetMapping("/{contentId}")
    public ContentDetailDto findById(
        @PathVariable Integer contentId
    ){

        Content content =
            contentService.findPublicById(contentId);

        return mapper.toDto(content);
    }
    
}

