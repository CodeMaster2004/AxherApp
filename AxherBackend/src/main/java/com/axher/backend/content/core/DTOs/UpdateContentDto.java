package com.axher.backend.content.core.DTOs;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.movies.DTOs.UpdateMovieDto;
import com.axher.backend.content.series.DTOs.SeriesDTOs.UpdateSeriesRequestDto;

import lombok.Data;

@Data
public class UpdateContentDto {
    private String title;
    private String description;

    private ContentTypeEnum type;

    private MultipartFile posterFile;
    private MultipartFile backdropFile;

    private MultipartFile trailerFile;

    private BigDecimal price;
    
    private List<Integer> categoryIds; // objetos completos
    private Integer statusId;
    private Integer discountId;
    private LocalDateTime releaseDate;

    private UpdateMovieDto movie;
    private UpdateSeriesRequestDto series;
   
}

