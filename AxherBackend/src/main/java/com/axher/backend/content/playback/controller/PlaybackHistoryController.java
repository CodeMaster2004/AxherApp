package com.axher.backend.content.playback.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.playback.DTOs.ContinueWatchingDto;
import com.axher.backend.content.playback.DTOs.PlaybackHistoryRequestDto;
import com.axher.backend.content.playback.DTOs.PlaybackHistoryResponseDto;
import com.axher.backend.content.playback.entities.PlaybackHistory;
import com.axher.backend.content.playback.mapper.PlaybackHistoryMapper;
import com.axher.backend.content.playback.service.PlaybackHistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/playback-history")
public class PlaybackHistoryController {

    private final PlaybackHistoryService service;
    private final PlaybackHistoryMapper mapper;

    //==============================
    //GUARDAR O ACTUALIZAR PROGRESO
    //==============================
    @PostMapping
    public ResponseEntity<PlaybackHistoryResponseDto> saveOrUpdate(
        @RequestBody PlaybackHistoryRequestDto dto
    ){
        System.out.println("🇦CONTENT ID: " + dto.getContentId());
    System.out.println("🇦EPISODE ID: " + dto.getEpisodeId());
    System.out.println("🇦SECONDS: " + dto.getWatchedSeconds());
        PlaybackHistory history = service.saveOrUpdate(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(mapper.toDto(history));
    }

    //==============================
    //OBTENER HISTORIAL DEL USUARIO
    //==============================
    @GetMapping
    public List<PlaybackHistoryResponseDto> getHistory(
    ){
        return service.getHistory()
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    //
    @GetMapping("/progress")
    public ResponseEntity<PlaybackHistoryResponseDto> getProgress(
            @RequestParam Integer contentId,
            @RequestParam(required = false) Integer episodeId){

        PlaybackHistory history = service.getProgress(contentId, episodeId);

        if(history == null){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(mapper.toDto(history));
    }

    @GetMapping("/continue-watching")
    public List<ContinueWatchingDto> getContinueWatching(){
        return service.getContinueWatching();
    }
    
    
}

