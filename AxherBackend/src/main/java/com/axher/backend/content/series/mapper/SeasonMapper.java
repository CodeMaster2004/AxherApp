package com.axher.backend.content.series.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonResponseDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.entities.Seasons;

@Component
public class SeasonMapper {
    
    @Value("${app.base-url}")
    private String baseUrl;

    public SeasonResponseDto toDto(Seasons season){
        if(season == null){
            return null;
        }

        SeasonResponseDto dto = new SeasonResponseDto();

        dto.setSeasonId(season.getSeasonId());
        dto.setSeasonNumber(season.getSeasonNumber());
        dto.setTitle(season.getTitle());
        dto.setDescription(season.getDescription());
        dto.setReleaseDate(season.getReleaseDate());

        if(season.getEpisodes() != null){
            dto.setEpisodes(
                season.getEpisodes()
                    .stream()
                    .map(this::mapEpisode)
                    .collect(Collectors.toList())
            );
        }

        return dto;
    }

    private EpisodeResponseDto mapEpisode(Episodes episode){

        if(episode == null){
            return null;
        }

        EpisodeResponseDto episodeDto = new EpisodeResponseDto();
        episodeDto.setEpisodeId(episode.getEpisodeId());
        episodeDto.setEpisodeNumber(episode.getEpisodeNumber());
        episodeDto.setTitle(episode.getTitle());
        episodeDto.setDescription(episode.getDescription());
        episodeDto.setDurationSeconds(episode.getDurationSeconds());
        episodeDto.setThumbnailUrl(buildUrl(episode.getThumbnailUrl()));
        episodeDto.setEpisodeUrl(buildUrl(episode.getEpisodeUrl()));
        episodeDto.setReleaseDate(episode.getReleaseDate());
        
        episodeDto.setSeasonNumber(
            episode.getSeason().getSeasonNumber()
        );


        episodeDto.setSeriesTitle(
            episode.getSeason()
                .getSeries()
                .getContent()
                .getTitle()
        );
        return episodeDto;

    }

    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
}

