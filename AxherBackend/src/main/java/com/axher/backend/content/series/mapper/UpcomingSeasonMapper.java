package com.axher.backend.content.series.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.seasonDTOs.UpcomingSeasonDto;
import com.axher.backend.content.series.entities.Seasons;

@Component
public class UpcomingSeasonMapper {

    public UpcomingSeasonDto toDto(Seasons season) {
        
        UpcomingSeasonDto dto = new UpcomingSeasonDto();

        dto.setSeasonId(season.getSeasonId());
        dto.setSeasonNumber(season.getSeasonNumber());
        dto.setTitle(season.getTitle());
        dto.setDescription(season.getDescription());
        dto.setReleaseDate(season.getReleaseDate());
        
        return dto;
    }
    
}
