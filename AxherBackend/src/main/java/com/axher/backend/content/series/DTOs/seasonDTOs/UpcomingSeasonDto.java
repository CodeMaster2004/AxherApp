package com.axher.backend.content.series.DTOs.seasonDTOs;

import java.time.LocalDateTime;


import lombok.Data;

@Data
public class UpcomingSeasonDto {

    private Integer seasonId;
    private Integer seasonNumber;
    private String title;
    private String description;
    private LocalDateTime releaseDate;
    
}
