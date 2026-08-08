package com.axher.backend.content.core.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.UpcomingContentDto;
import com.axher.backend.content.core.entities.Content;

@Component
public class UpcomingContentMapper {
    
    @Value("${app.base-url}")
    private String baseUrl;

    public UpcomingContentDto toDto(Content content) {
        
        UpcomingContentDto dto = new UpcomingContentDto();

        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setPosterUrl(buildUrl(content.getPosterUrl()));
        dto.setBackdropUrl(buildUrl(content.getBackdropUrl()));
        dto.setDescription(content.getDescription());
        dto.setReleaseDate(content.getReleaseDate().toString());
        dto.setCategories(
            content.getCategories()
                 .stream()
                 .map(c -> c.getName())
                 .collect(Collectors.toList())
        );
        dto.setType(content.getType());
        return dto;
    }

    private String buildUrl(String path) {

        if(path == null) return null;
        return baseUrl + path;
    }
}
