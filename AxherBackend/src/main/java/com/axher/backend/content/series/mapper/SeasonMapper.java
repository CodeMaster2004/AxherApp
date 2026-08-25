package com.axher.backend.content.series.mapper;


import org.springframework.stereotype.Component;

import com.axher.backend.content.core.mapper.ContentStatusMapper;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonResponseDto;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.service.SeasonLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SeasonMapper {

    private final ContentStatusMapper contentStatusMapper;
    private final SeasonLocalizationService seasonLocalizationService;


    public SeasonResponseDto toDto(Seasons season){
        if(season == null){
            return null;
        }

        SeasonResponseDto dto = new SeasonResponseDto();

        SeasonLocalizationService.LocalizedSeason localized =
            seasonLocalizationService.resolve(season);

        dto.setSeasonId(season.getSeasonId());
        dto.setSeasonNumber(season.getSeasonNumber());
        dto.setTitle(localized.title());
        dto.setDescription(localized.description());
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

