package com.axher.backend.content.core.DTOs;

import com.axher.backend.content.core.entities.Content;

public record TopRatedContentResult(
    Content content,
    Double averageRating,
    Long totalRatings,
    Double score
) {

    public TopRatedContentResult(
        Content content,
        Double averageRating,
        Long totalRatings
    ) {
        this(
            content,
            averageRating,
            totalRatings,
            null
        );
    }
}
