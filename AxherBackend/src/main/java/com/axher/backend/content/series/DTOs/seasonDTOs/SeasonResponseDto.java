package com.axher.backend.content.series.DTOs.seasonDTOs;

import java.time.LocalDate;
import java.util.List;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;

import lombok.Data;

@Data
public class SeasonResponseDto {
    private Integer seasonId;
    private Integer seasonNumber;
    private String title;
    private String description;
    private LocalDate releaseDate;
    private List<EpisodeResponseDto> episodes;
}
