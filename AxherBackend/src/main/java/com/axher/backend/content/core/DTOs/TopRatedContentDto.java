package com.axher.backend.content.core.DTOs;


import com.axher.backend.content.core.entities.ContentTypeEnum;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TopRatedContentDto {
    private Integer contentId;
    private String title;
    private String description;
    private String backdropUrl;
    private String trailerUrl;
    private Double averageRating;
    private Long totalRatings;
    private ContentTypeEnum type;

    private String reason;
    private Double score;

    public TopRatedContentDto(
            Integer contentId,
            String title,
            String description,
            String backdropUrl,
            String trailerUrl,
            ContentTypeEnum type,
            Double averageRating,
            Long totalRatings
    ) {
        this.contentId = contentId;
        this.title = title;
        this.description = description;
        this.backdropUrl = backdropUrl;
        this.trailerUrl = trailerUrl;
        this.type = type;
        this.averageRating = averageRating;
        this.totalRatings = totalRatings;
    }
}

