package com.axher.backend.content.core.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.TrendingContentDto;

@Component
public class TrendingMapper {

    @Value("${app.base-url}")
    private String baseUrl;


    public TrendingContentDto toDto(TrendingContentDto dto){

        TrendingContentDto response = new TrendingContentDto();

        response.setContentId(dto.getContentId());
        response.setTitle(dto.getTitle());
        response.setPosterUrl(buildUrl(dto.getPosterUrl()));
        response.setType(dto.getType());
        response.setTotalViews(dto.getTotalViews());
        response.setUniqueUsers(dto.getUniqueUsers());
        response.setTotalWatchedSeconds(dto.getTotalWatchedSeconds());
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