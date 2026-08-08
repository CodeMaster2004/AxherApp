package com.axher.backend.content.series.DTOs.SeriesDTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


import lombok.Data;

@Data
public class SeriesDetailResponseDto {
    private Integer contentId;
    private String title;
    private String description;
    private String posterUrl;
    private String trailerUrl;
    private BigDecimal price;

    //Metadatos del conten
    private List<String> categories;
    private String status;
    private BigDecimal discountAmount;
    private LocalDate registeredAt;

    private Integer seasonCount;
    //private List<SeasonResponseDto> seasons;
}
