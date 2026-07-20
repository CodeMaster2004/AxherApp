package com.axher.backend.content.ratings.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.ratings.DTOs.RatingRequestDto;
import com.axher.backend.content.ratings.DTOs.RatingResponseDto;
import com.axher.backend.content.ratings.DTOs.RatingSummaryDto;
import com.axher.backend.content.ratings.entities.Ratings;
import com.axher.backend.content.ratings.entities.TargetTypeEnum;
import com.axher.backend.content.ratings.mapper.RatingsMapper;
import com.axher.backend.content.ratings.service.RatingsService;

import lombok.RequiredArgsConstructor;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ratings")
public class RatingsController {

    private final RatingsService service;
    private final RatingsMapper mapper;

    // ==============================
    // OBTENER POR ID
    // ==============================
    @GetMapping("/id/{ratingId}")
    public ResponseEntity<RatingResponseDto> findById(@PathVariable Integer ratingId) {
        Ratings rating = service.findById(ratingId);
        return ResponseEntity.ok(mapper.toDto(rating));
    }

    // ==============================
    // LISTAR POR USUARIO
    // ==============================
    @GetMapping("/user/{userId}")
    public Page<RatingResponseDto> getByUser(
        @PathVariable Integer userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<Ratings> ratingPage = service.getByUserId(userId, PageRequest.of(page, size));
        return ratingPage.map(mapper::toDto);
       
    }

    // ==============================
    // LISTAR POR TIPO (MOVIE, SERIES, etc.)
    // ==============================
    @GetMapping("target")
    public Page<RatingResponseDto> getByType(
        @PathVariable TargetTypeEnum type,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Page<Ratings> ratingPage = service.getByTargetType(type, PageRequest.of(page, size));
        return ratingPage.map(mapper::toDto);
    }

    // ==============================
    // CREAR
    // ==============================
    @PostMapping
    public ResponseEntity<RatingResponseDto> create(@RequestBody RatingRequestDto dto) {
        Ratings createdRating = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapper.toDto(createdRating));
    }

    // ==============================
    // ACTUALIZAR
    // ==============================
    @PatchMapping("/{ratingId}")
    public ResponseEntity<RatingResponseDto> update(
            @PathVariable Integer ratingId,
            @RequestBody RatingRequestDto dto) {

        Ratings updateRating = service.update(ratingId, dto);
        return ResponseEntity.ok(mapper.toDto(updateRating));
    }

    // ==============================
    // ELIMINAR
    // ==============================
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> delete(@PathVariable Integer ratingId) {
        service.delete(ratingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user-rating")
    public ResponseEntity<RatingResponseDto> getUserRating(
            @RequestParam Integer userId,
            @RequestParam TargetTypeEnum targetType,
            @RequestParam Integer targetId
    ) {

        Ratings rating = service.findUserRating(
            userId,
            targetType,
            targetId
        );

        return ResponseEntity.ok(mapper.toDto(rating));
    }

    // ==============================
    // OBTENER RESUMEN DE CALIFICACIONES
    // ==============================
    @GetMapping("/summary")
    public ResponseEntity<RatingSummaryDto> getSummary(
            @RequestParam TargetTypeEnum targetType,
            @RequestParam Integer targetId
    ){
        return ResponseEntity.ok(
            service.getSymmary(targetType, targetId)
        );
    }


}

