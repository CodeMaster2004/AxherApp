package com.axher.backend.content.series.DTOs.seasonDTOs;

import java.time.LocalDate;
import java.util.List;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.CreateEpisodeRequestDto;

import lombok.Data;

@Data
public class CreateSeasonRequestDto {
    private Integer seasonNumber;
    private String title;
    private String description;
    private LocalDate releaseDate;
    private List<CreateEpisodeRequestDto> episodes;
}
