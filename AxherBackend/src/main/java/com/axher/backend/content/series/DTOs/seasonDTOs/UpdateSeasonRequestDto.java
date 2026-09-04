package com.axher.backend.content.series.DTOs.seasonDTOs;

import java.time.Instant;
import java.util.List;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpdateEpisodeRequestDto;

import lombok.Data;

@Data
public class UpdateSeasonRequestDto {
    private Integer seasonId;
    private Integer seasonNumber;
    private String title;
    private String description;
    private Instant releaseDate;
    private Integer statusId;
    private List<UpdateEpisodeRequestDto> episodes;
}
