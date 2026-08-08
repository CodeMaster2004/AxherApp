package com.axher.backend.content.series.mapper;


import org.springframework.stereotype.Component;

import com.axher.backend.content.core.mapper.ContentStatusMapper;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonResponseDto;
import com.axher.backend.content.series.entities.Seasons;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SeasonMapper {

    private final ContentStatusMapper contentStatusMapper;


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
        dto.setStatus(
            contentStatusMapper.toDto(season.getContentStatus())
        );

        dto.setEpisodeCount(
            season.getEpisodes() != null
            ? season.getEpisodes().size()
            : 0
        );

        return dto;
    }

}

