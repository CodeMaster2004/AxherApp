package com.axher.backend.content.core.DTOs;

import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentFeaturedDto {
    private Integer contentId;
    private String title;
    private String backdropUrl;
    private String description;
    private String trailerUrl;
    private ContentTypeEnum type; 
}
