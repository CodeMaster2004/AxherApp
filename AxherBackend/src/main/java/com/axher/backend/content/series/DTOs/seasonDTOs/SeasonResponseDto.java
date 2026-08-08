package com.axher.backend.content.series.DTOs.seasonDTOs;

import java.time.LocalDateTime;

import com.axher.backend.content.core.DTOs.ContentStatusResponseDto;

import lombok.Data;

@Data
public class SeasonResponseDto {
    private Integer seasonId;
    private Integer seasonNumber;
    private String title;
    private String description;
    private LocalDateTime releaseDate;
    private ContentStatusResponseDto status;
    private Integer episodeCount;
    //private List<EpisodeResponseDto> episodes;
}
