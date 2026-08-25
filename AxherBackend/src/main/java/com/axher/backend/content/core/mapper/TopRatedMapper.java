package com.axher.backend.content.core.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.core.DTOs.TopRatedContentResult;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TopRatedMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService localizationService;
    
    public TopRatedContentDto toTopRatedDto(
            TopRatedContentResult result
    ){
        Content content = result.content();

        ContentLocalizationService.LocalizedContent localized =
            localizationService.resolve(content);

        TopRatedContentDto response = new TopRatedContentDto();

        response.setContentId(content.getContentId());
        response.setTitle(localized.title());
        response.setPosterUrl(buildUrl(content.getPosterUrl()));
        response.setType(content.getType());

        response.setAverageRating(result.averageRating());
        response.setTotalRatings(result.totalRatings());
        response.setScore(result.score());

        return response;
    }
    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}

