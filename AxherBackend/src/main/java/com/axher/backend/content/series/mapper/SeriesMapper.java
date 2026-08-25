package com.axher.backend.content.series.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.service.ContentCategoryLocalizationService;
import com.axher.backend.content.core.service.ContentLocalizationService;
import com.axher.backend.content.series.DTOs.SeriesDTOs.SeriesDetailResponseDto;
import com.axher.backend.content.series.entities.Series;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SeriesMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService contentLocalizationService;
    private final ContentCategoryLocalizationService contentCategoryLocalizationService;

    public SeriesDetailResponseDto toDto(Series series){
        if(series == null || series.getContent() == null) {
            return null;
        }

        SeriesDetailResponseDto dto = new SeriesDetailResponseDto();

        var content = series.getContent();

        /*
         * Resolver título y descripción según
         * el idioma actual.
         */
        var localized =
                contentLocalizationService.resolve(content);

        dto.setContentId(series.getContent().getContentId());
        dto.setTitle(localized.title());
        dto.setDescription(localized.description());
        dto.setPosterUrl(buildUrl(series.getContent().getPosterUrl()));
        dto.setTrailerUrl(buildUrl(series.getContent().getTrailerUrl()));
        dto.setPrice(series.getContent().getPrice());

        //Categorias
        dto.setCategories(
            content.getCategories()
                .stream()
                .map(category ->
                    contentCategoryLocalizationService
                        .resolve(category)
                        .name()
                )
                .toList()
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

