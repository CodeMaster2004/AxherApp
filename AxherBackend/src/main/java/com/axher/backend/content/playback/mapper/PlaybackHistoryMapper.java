package com.axher.backend.content.playback.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.service.ContentLocalizationService;
import com.axher.backend.content.movies.entities.Movies;
import com.axher.backend.content.playback.DTOs.PlaybackHistoryResponseDto;
import com.axher.backend.content.playback.entities.PlaybackHistory;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class PlaybackHistoryMapper {

    private final ContentLocalizationService contentLocalizationService;

    public PlaybackHistoryResponseDto toDto(PlaybackHistory history){
        
        PlaybackHistoryResponseDto dto = new PlaybackHistoryResponseDto();

        var content = history.getContent();

        /*
         * Resolver título según el idioma actual.
         */
        var localized =
                contentLocalizationService.resolve(content);

        dto.setPlaybackHistoryId(history.getPlaybackHistoryId());
        dto.setContentId(history.getContent().getContentId());
        if(history.getEpisode() != null){
            dto.setEpisodeId(history.getEpisode().getEpisodeId());
        }
        dto.setTitle(localized.title());
        dto.setPosterUrl(history.getContent().getPosterUrl());
        dto.setWatchedSeconds(history.getWatchedSeconds());
        dto.setWatchedAt(history.getWatchedAt());

        if (history.getEpisode() == null) {
            Movies movie = history.getContent().getMovie();

            if (movie != null) {
                dto.setProgress(
                    calculateProgress(
                        history.getWatchedSeconds(),
                        movie.getDurationSeconds()
                    )
                );
            }
        } else {
            dto.setProgress(
                calculateProgress(
                    history.getWatchedSeconds(),
                    history.getEpisode().getDurationSeconds()
                )
            );
        }


        return dto;
    }

    private Double calculateProgress(Integer watchedSeconds, Integer durationSeconds) {

        if (watchedSeconds == null ||
            durationSeconds == null ||
            durationSeconds <= 0) {
            return null;
        }

        double progress = watchedSeconds * 100.0 / durationSeconds;

        return Math.min(100.0, Math.round(progress * 100.0) / 100.0);
    }
    
}

