package com.axher.backend.content.series.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.SeriesDTOs.SeriesDetailResponseDto;
import com.axher.backend.content.series.entities.Series;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SeriesMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public SeriesDetailResponseDto toDto(Series series){
        if(series == null || series.getContent() == null) {
            return null;
        }

        SeriesDetailResponseDto dto = new SeriesDetailResponseDto();

        dto.setContentId(series.getContent().getContentId());
        dto.setTitle(series.getContent().getTitle());
        dto.setDescription(series.getContent().getDescription());
        dto.setPosterUrl(buildUrl(series.getContent().getPosterUrl()));
        dto.setTrailerUrl(buildUrl(series.getContent().getTrailerUrl()));
        dto.setPrice(series.getContent().getPrice());

        //Categorias
        dto.setCategories(
            series.getContent().getCategories()
                .stream()
                .map(c -> c.getName())
                .collect(Collectors.toList())
        );

        //Status
        dto.setStatus(
            series.getContent().getContentStatus() != null
                ? series.getContent().getContentStatus().getCode()
                : null
        );

        // Descuento
        dto.setDiscountAmount(
            series.getContent().getDiscount() != null
                ? series.getContent().getDiscount().getAmount()
                : null
        );
        dto.setSeasonCount(
            series.getSeasons() != null
                ? series.getSeasons().size()
                : 0
        );

        return dto;
    }

    private String buildUrl(String path){
        if(path == null) return null;
        return baseUrl + path;
    }
}

