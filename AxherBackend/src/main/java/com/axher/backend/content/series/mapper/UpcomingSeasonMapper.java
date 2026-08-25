package com.axher.backend.content.series.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.seasonDTOs.UpcomingSeasonDto;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.service.SeasonLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UpcomingSeasonMapper {
    
    private final SeasonLocalizationService seasonLocalizationService;
    
    public UpcomingSeasonDto toDto(Seasons season) {
        
        UpcomingSeasonDto dto = new UpcomingSeasonDto();

        var localized =
                seasonLocalizationService.resolve(season);

        dto.setSeasonId(season.getSeasonId());
        dto.setSeasonNumber(season.getSeasonNumber());
        dto.setTitle(localized.title());
        dto.setDescription(localized.description());
        dto.setReleaseDate(season.getReleaseDate());
        
        return dto;
    }
    
}
