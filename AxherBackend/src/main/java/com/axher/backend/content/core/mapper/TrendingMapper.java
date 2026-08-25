package com.axher.backend.content.core.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.TrendingContentDto;
import com.axher.backend.content.core.DTOs.TrendingContentResult;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.service.ContentLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TrendingMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentLocalizationService localizationService;


    public TrendingContentDto toDto(TrendingContentResult result){

        Content content = result.content();
        ContentLocalizationService.LocalizedContent localized =
                localizationService.resolve(content);

        TrendingContentDto response = new TrendingContentDto();

        response.setContentId(content.getContentId());
        response.setTitle(localized.title());
        response.setPosterUrl(buildUrl(content.getPosterUrl()));
        response.setType(content.getType());
        response.setTotalViews(result.totalViews());
        response.setUniqueUsers(result.uniqueUsers());
        response.setTotalWatchedSeconds(result.totalWatchedSeconds());
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