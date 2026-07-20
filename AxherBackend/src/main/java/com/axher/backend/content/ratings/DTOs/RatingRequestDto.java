package com.axher.backend.content.ratings.DTOs;

import com.axher.backend.content.ratings.entities.TargetTypeEnum;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingRequestDto {
    private Integer userId;
    private TargetTypeEnum targetType;
    private Integer targetId;
    private Integer ratingValue;
    private String comment;
}
