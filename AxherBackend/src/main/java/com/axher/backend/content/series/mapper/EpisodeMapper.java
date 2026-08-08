package com.axher.backend.content.series.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.mapper.ContentStatusMapper;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;
import com.axher.backend.content.series.entities.Episodes;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class EpisodeMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentStatusMapper contentStatusMapper;

    public EpisodeResponseDto toDto(Episodes episode){
        
        EpisodeResponseDto dto = new EpisodeResponseDto();
        dto.setEpisodeId(episode.getEpisodeId());
        dto.setEpisodeNumber(episode.getEpisodeNumber());
        dto.setTitle(episode.getTitle());
        dto.setDescription(episode.getDescription());
        dto.setDurationSeconds(episode.getDurationSeconds());
        dto.setThumbnailUrl(buildUrl(episode.getThumbnailUrl()));
        dto.setEpisodeUrl(buildUrl(episode.getEpisodeUrl()));
        dto.setReleaseDate(episode.getReleaseDate());
        dto.setStatus(
            contentStatusMapper.toDto(episode.getContentStatus())
        );
        dto.setSeasonNumber(
            episode.getSeason()
                .getSeasonNumber()
        );

       dto.setSeriesTitle(
            episode.getSeason()
                .getSeries()
                .getContent()
                .getTitle()
        );

        
        return dto;
    }


    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}

