package com.axher.backend.content.playback.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.playback.DTOs.ContinueWatchingDto;
import com.axher.backend.content.playback.entities.PlaybackHistory;

@Component
public class ContinueWatchingMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public ContinueWatchingDto toContinueWatching(PlaybackHistory history){

        ContinueWatchingDto dto = new ContinueWatchingDto();
        var content = history.getContent();

        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setBackdropUrl(buildUrl(content.getBackdropUrl()));
        dto.setContentType(content.getType());

        if(history.getEpisode() != null){

            var episode = history.getEpisode();

            dto.setEpisodeId(episode.getEpisodeId());
            dto.setSeasonNumber(episode.getSeason().getSeasonNumber());
            dto.setEpisodeNumber(episode.getEpisodeNumber());
            dto.setEpisodeTitle(episode.getTitle());
            dto.setDurationSeconds(episode.getDurationSeconds());

        }else{

            dto.setDurationSeconds(content.getMovie().getDurationSeconds());
        }


        dto.setWatchedSeconds(history.getWatchedSeconds());
        dto.setProgress(calculateProgress(history));

        return dto;
    }



    private Double calculateProgress(PlaybackHistory history){

        Integer duration;

        if(history.getEpisode() != null){

            duration =history.getEpisode().getDurationSeconds();

        }else{
            duration =history.getContent().getMovie().getDurationSeconds();
        }

        if(duration == null ||duration <= 0 ||
           history.getWatchedSeconds() == null){

            return null;
        }

        double progress =
            history.getWatchedSeconds()
            *100.0
            /duration;

        return Math.min(
            100,
            Math.round(progress*100.0)/100.0
        );
    }

    private String buildUrl(String path){
        if(path == null) return null;
        return baseUrl + path;
    }
    
}
