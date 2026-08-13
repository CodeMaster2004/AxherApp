package com.axher.backend.catalog.watchlist.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.catalog.watchlist.DTOs.WatchlistRequestDto;
import com.axher.backend.catalog.watchlist.DTOs.WatchlistResponseDto;
import com.axher.backend.catalog.watchlist.entities.Watchlist;
import com.axher.backend.catalog.watchlist.mapper.WatchlistMapper;
import com.axher.backend.catalog.watchlist.service.WatchlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/watchlist")
public class WatchlistController {

    private final WatchlistService service;
    private final WatchlistMapper mapper;

    // ==============================
    // LISTAR LISTA DEL USUARIO
    // ==============================
    @GetMapping
    public Page<WatchlistResponseDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Page<Watchlist> favoritesPage = service.findByUserId(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "addedAt"))
        );
        return favoritesPage.map(mapper::toDto);
    }

    // ==============================
    // OBTENER ELEMENTO DE LA LISTA POR ID
    // ==============================
    @GetMapping("/{watchlistId}")
    public ResponseEntity<WatchlistResponseDto> findById(
        @PathVariable Integer favoriteId
    ){
        Watchlist favorite = service.findById(favoriteId);
        return ResponseEntity.ok(mapper.toDto(favorite));
    }

    // ==============================
    // VERIFICAR SI ESTA EN LA LISTA
    // ==============================
    @GetMapping("/check")
    public ResponseEntity<Boolean> isFavorite(
        @RequestParam Integer contentId
    ){
        return ResponseEntity.ok(
            service.isInWatchlist(contentId)
        );
    }

    // ==============================
    // AGREGAR A LA LISTA
    // ==============================
    @PostMapping
    public ResponseEntity<WatchlistResponseDto> add(
        @RequestBody WatchlistRequestDto request
    ){
        Watchlist favorite = service.add(request.getContentId());
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(mapper.toDto(favorite));
    }

    // ==============================
    // ELIMINAR DE LA LISTA
    // ==============================
    @DeleteMapping("/{contentId}")
    public ResponseEntity<Void> remove(
        @PathVariable Integer contentId
    ){
        service.remove(contentId);
        return ResponseEntity.noContent().build();
    }

    
}
