package com.axher.backend.content.core.DTOs;


import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopRatedContentDto {
    private Integer contentId;
    private String title;
    private String posterUrl;
    private ContentTypeEnum type;

    private Double averageRating;
    private Long totalRatings;
    private Double score;

    public TopRatedContentDto(
            Integer contentId,
            String title,
            String posterUrl,
            ContentTypeEnum type,
            Double averageRating,
            Long totalRatings
    ){
        this.contentId = contentId;
        this.title = title;
        this.posterUrl = posterUrl;
        this.type = type;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
    }

   
}

