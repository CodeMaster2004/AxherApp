package com.axher.backend.content.series.DTOs.seasonDTOs;

import java.time.Instant;


import lombok.Data;

@Data
public class UpcomingSeasonDto {

    private Integer seasonId;
    private Integer seasonNumber;
    private String title;
    private String description;
    private Instant releaseDate;
    
}
