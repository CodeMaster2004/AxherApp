package com.axher.backend.content.core.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.TopRatedContentDto;

@Component
public class TopRatedMapper {

    @Value("${app.base-url}")
    private String baseUrl;
    
    public TopRatedContentDto toTopRatedDto(
            TopRatedContentDto dto
    ){

        TopRatedContentDto response = new TopRatedContentDto();

        response.setContentId(dto.getContentId());
        response.setTitle(dto.getTitle());
        response.setBackdropUrl(buildUrl(dto.getBackdropUrl()));
        response.setAverageRating(dto.getAverageRating());
        response.setTotalRatings(dto.getTotalRatings());

        response.setScore(dto.getScore());

        return response;
    }
    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}

