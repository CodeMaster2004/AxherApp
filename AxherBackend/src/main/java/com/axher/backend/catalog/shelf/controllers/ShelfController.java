package com.axher.backend.catalog.shelf.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.shelf.DTOs.ShelfDto;
import com.axher.backend.catalog.shelf.entities.ShelfTarget;
import com.axher.backend.catalog.shelf.service.ShelfService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/shelves")
@RequiredArgsConstructor
public class ShelfController {

    private final ShelfService shelfService;

    @GetMapping
    public List<ShelfDto> getShelves(
            @RequestParam ShelfTarget target,
            @RequestParam(required = false) String slug //temporal
        ) {

        return shelfService.getShelves(target, slug);
    }
    
    
}
