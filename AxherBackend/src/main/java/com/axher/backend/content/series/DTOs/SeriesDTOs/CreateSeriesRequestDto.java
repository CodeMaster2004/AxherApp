package com.axher.backend.content.series.DTOs.SeriesDTOs;

import java.util.List;

import com.axher.backend.content.series.DTOs.seasonDTOs.CreateSeasonRequestDto;

import lombok.Data;

@Data
public class CreateSeriesRequestDto {
    private List<CreateSeasonRequestDto> seasons;
    
}
