package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EpisodeResponseDto {
    private Integer episodeId;
    private Integer episodeNumber;
    private String title;
    private String description;
    private Integer durationSeconds;
    private String thumbnailUrl;
    private String episodeUrl;
    private LocalDate releaseDate;

    private Integer seasonNumber;
    private String seriesTitle;
}
