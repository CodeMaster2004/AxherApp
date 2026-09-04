package com.axher.backend.content.ratings.DTOs;

import java.time.Instant;

import com.axher.backend.content.ratings.entities.TargetTypeEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponseDto {
    private Integer ratingId;
    private Integer userId;
    private TargetTypeEnum targetType;
    private Integer targetId;
    private Integer ratingValue;
    private String comment;
    private Instant ratedAt;
}
