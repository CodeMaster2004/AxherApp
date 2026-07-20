package com.axher.backend.content.playback.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaybackHistoryRequestDto {
    private Integer contentId;
    private Integer episodeId;
    private Integer watchedSeconds;
}
