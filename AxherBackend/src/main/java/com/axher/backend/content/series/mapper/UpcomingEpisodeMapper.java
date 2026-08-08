package com.axher.backend.content.series.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpcomingEpisodeDto;
import com.axher.backend.content.series.entities.Episodes;



@Component
public class UpcomingEpisodeMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public UpcomingEpisodeDto toDto(Episodes episode) {
        
        UpcomingEpisodeDto dto = new UpcomingEpisodeDto();

        dto.setEpisodeId(episode.getEpisodeId());
        dto.setEpisodeNumber(episode.getEpisodeNumber());
        dto.setTitle(episode.getTitle());
        dto.setDescription(episode.getDescription());
        dto.setDurationSeconds(episode.getDurationSeconds());
        dto.setThumbnailUrl(buildUrl(episode.getThumbnailUrl()));
        dto.setReleaseDate(episode.getReleaseDate());

        dto.setSeasonNumber(
            episode.getSeason()
                .getSeasonNumber()
        );

        
        return dto;
    }

    private String buildUrl(String path){
        if(path == null) return null;
        return baseUrl + path;
    }
    
}
