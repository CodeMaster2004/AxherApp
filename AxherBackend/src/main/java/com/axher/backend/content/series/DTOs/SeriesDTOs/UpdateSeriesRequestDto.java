package com.axher.backend.content.series.DTOs.SeriesDTOs;

import java.util.List;

import com.axher.backend.content.series.DTOs.seasonDTOs.UpdateSeasonRequestDto;

import lombok.Data;

@Data
public class UpdateSeriesRequestDto {
    private List<UpdateSeasonRequestDto> seasons;
    
}
