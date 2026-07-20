package com.axher.backend.content.core.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentFeaturedDto;
import com.axher.backend.content.core.DTOs.PopularContentDto;

@Component
public class PopularityMapper {
    
    @Value("${app.base-url}")
    private String baseUrl;

    public ContentFeaturedDto toFeaturedDto(ContentFeaturedDto dto) {

        ContentFeaturedDto response = new ContentFeaturedDto();

        response.setContentId(dto.getContentId());
        response.setTitle(dto.getTitle());
        response.setDescription(dto.getDescription());
        response.setBackdropUrl(buildUrl(dto.getBackdropUrl()));
        response.setType(dto.getType());

        return response;
    }

    public PopularContentDto toPopularDto(PopularContentDto dto) {

        PopularContentDto response = new PopularContentDto();

        response.setContentId(dto.getContentId());
        response.setTitle(dto.getTitle());
        response.setPosterUrl(buildUrl(dto.getPosterUrl()));
        response.setWatchedSeconds(dto.getWatchedSeconds());

        return response;
    }

    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
}

