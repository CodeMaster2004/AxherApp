package com.axher.backend.content.playback.DTOs;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaybackHistoryResponseDto {
    private Integer playbackHistoryId;
    private Integer userId;
    private Integer contentId;
    private Integer episodeId;
    private String title;
    private String posterUrl;
    private Integer watchedSeconds;
    private Double progress;
    private Instant watchedAt;
}
