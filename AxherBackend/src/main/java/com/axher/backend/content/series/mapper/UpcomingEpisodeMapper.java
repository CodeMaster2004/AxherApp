package com.axher.backend.content.series.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpcomingEpisodeDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.service.EpisodeLocalizationService;

import lombok.RequiredArgsConstructor;



@Component
@RequiredArgsConstructor
public class UpcomingEpisodeMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final EpisodeLocalizationService episodeLocalizationService;

    public UpcomingEpisodeDto toDto(Episodes episode) {
        
        UpcomingEpisodeDto dto = new UpcomingEpisodeDto();

        var localized =
                episodeLocalizationService.resolve(episode);

        dto.setEpisodeId(episode.getEpisodeId());
        dto.setEpisodeNumber(episode.getEpisodeNumber());
        dto.setTitle(localized.title());
        dto.setDescription(localized.description());
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
