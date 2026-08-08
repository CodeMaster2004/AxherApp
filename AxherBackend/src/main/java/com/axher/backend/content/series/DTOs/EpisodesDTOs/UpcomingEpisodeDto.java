package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import java.time.LocalDateTime;


import lombok.Data;
@Data
public class UpcomingEpisodeDto {
    private Integer episodeId;
    private Integer episodeNumber;
    private String title;
    private String description;
    private Integer durationSeconds;
    private String thumbnailUrl;
    private LocalDateTime releaseDate;

    private Integer seasonNumber;
    private String seriesTitle;
}
