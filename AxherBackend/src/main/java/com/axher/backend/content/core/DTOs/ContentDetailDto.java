package com.axher.backend.content.core.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.Data;

@Data
public class ContentDetailDto {
    private Integer contentId;
    private String title;
    private String description;

    private ContentTypeEnum type;

    private String posterUrl;
    private String backdropUrl;
    private String trailerUrl;

    private BigDecimal price;
    private List<String> categories;
    private ContentStatusResponseDto status;
    private BigDecimal discountAmount;
    private LocalDate registeredAt;

    //Solo si es Movvies
    private Integer durationSeconds;
    private String movieUrl;


}

