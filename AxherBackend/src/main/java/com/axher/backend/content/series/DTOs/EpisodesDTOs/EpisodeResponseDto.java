package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import java.time.LocalDateTime;

import com.axher.backend.content.core.DTOs.ContentStatusResponseDto;

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
    private LocalDateTime releaseDate;

    private Integer seasonNumber;
    private String seriesTitle;
    private ContentStatusResponseDto status;
}
