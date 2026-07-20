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
public class HeroContentDto {

    private Integer contentId;
    private String title;
    private String description;

    private String backdropUrl;
    private String trailerUrl;
    private ContentTypeEnum type;

    private String reason;
    private Number score;

    private Double averageRating;
    private Long totalViews;
    
}
