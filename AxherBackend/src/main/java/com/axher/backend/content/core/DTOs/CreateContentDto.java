package com.axher.backend.content.core.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.movies.DTOs.CreateMovieDto;
import com.axher.backend.content.series.DTOs.SeriesDTOs.CreateSeriesRequestDto;

import lombok.Data;

@Data
public class CreateContentDto {
    private String title;
    private String description;
    private ContentTypeEnum type;
    private MultipartFile posterFile;
    private MultipartFile backdropFile;
    private MultipartFile trailerFile;
    private BigDecimal price;
    private List<Integer> categoryIds;
    private Integer statusId;
    private Integer discountId;
    private LocalDate releaseDate;

    private CreateMovieDto movie;
    private CreateSeriesRequestDto series;
}
