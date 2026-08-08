package com.axher.backend.content.core.DTOs;

import java.util.List;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.Data;

@Data
public class UpcomingContentDto {
    
    private Integer contentId;
    private String title;
    private String posterUrl;
    private String backdropUrl;
    private String description;
    private String releaseDate;
    private List<String> categories;
    private ContentTypeEnum type;
}
