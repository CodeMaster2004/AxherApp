package com.axher.backend.content.ratings.DTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RatingSummaryDto {
    private Double averageRating;
    private Long totalRatings;
}
