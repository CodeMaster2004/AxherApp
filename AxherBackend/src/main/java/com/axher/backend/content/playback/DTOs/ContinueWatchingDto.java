package com.axher.backend.content.playback.DTOs;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContinueWatchingDto {

    private Integer contentId;
    private String title;
    private String backdropUrl;
    private ContentTypeEnum contentType;

    //Serie
    private Integer episodeId;
    private Integer seasonNumber;
    private Integer episodeNumber;
    private String episodeTitle;

    //Progress
    private Integer watchedSeconds;
    private Integer durationSeconds;
    private Double progress;
    
}
