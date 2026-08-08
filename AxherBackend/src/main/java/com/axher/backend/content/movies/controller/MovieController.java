package com.axher.backend.content.movies.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    /*@GetMapping
    public Page<ContentDetailDto> findMovies(
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) Integer year,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "contentId,desc") String sort
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "releaseDate");
        Page<Content> movies = contentService.filterContents(
            null,
            categoryId,
            year,
            null,
            null,
            ContentTypeEnum.MOVIE,
            PageRequest.of(page, size, sortObj)
        );
        return movies.map(mapper::toDto);
    }/* */

    /*@GetMapping("/new")
    public Page<ContentDetailDto> newMovies(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Page<Content> movies = movieCatalogService.findNewMovies(PageRequest.of(page, size));
        return movies.map(mapper::toDto);
    }*/
    
    
}
