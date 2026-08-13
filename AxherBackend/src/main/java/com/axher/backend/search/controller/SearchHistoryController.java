package com.axher.backend.search.controller;

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

import com.axher.backend.search.DTOs.SearchHistoryRequestDto;
import com.axher.backend.search.DTOs.SearchHistoryResponseDto;
import com.axher.backend.search.entities.SearchHistory;
import com.axher.backend.search.mapper.SearchHistoryMapper;
import com.axher.backend.search.service.SearchHistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search-history")
public class SearchHistoryController {

    private final SearchHistoryService service;
    private final SearchHistoryMapper mapper;

    //==============================
    //OBTENER HISTORIAL PAGINADO
    //==============================
    @GetMapping
    public Page<SearchHistoryResponseDto> getHistory(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ){
        Page<SearchHistory> historyPage = service.getHistory(
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "searchedAt"))
        );

        return historyPage.map(mapper::toDto);
    }

    //==============================
    //GUARDAR BUSQUEDA
    //==============================
    @PostMapping
    public ResponseEntity<SearchHistoryResponseDto> save(
        @RequestBody SearchHistoryRequestDto dto
    ){
        SearchHistory history = service.save(dto.getTerm());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.toDto(history));
    }

    //==============================
    //ELIMINAR UNA BUSQUEDA
    //==============================
    @DeleteMapping("/{searchId}")
    public ResponseEntity<Void> delete(
        @PathVariable Long searchId
    ){
        service.delete(searchId);
        return ResponseEntity.noContent().build();
    }

    //==============================
    //LIMPIAR HISTORIAL
    //==============================
    @DeleteMapping
    public ResponseEntity<Void> clearHistory(){
        service.clearHistory();
        return ResponseEntity.noContent().build();
    }
    
    
}
