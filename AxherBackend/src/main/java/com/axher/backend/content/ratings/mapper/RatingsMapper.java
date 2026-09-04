package com.axher.backend.content.ratings.mapper;

import java.time.Instant;

import org.springframework.stereotype.Component;

import com.axher.backend.content.ratings.DTOs.RatingRequestDto;
import com.axher.backend.content.ratings.DTOs.RatingResponseDto;
import com.axher.backend.content.ratings.entities.Ratings;
import com.axher.backend.users.entities.Users;


@Component
public class RatingsMapper {

    public Ratings toEntity(RatingRequestDto dto, Users user) {
        Ratings r = new Ratings();
        r.setUser(user);
        r.setTargetType(dto.getTargetType());
        r.setTargetId(dto.getTargetId());
        r.setRatingValue(dto.getRatingValue());
        r.setComment(dto.getComment());
        r.setRatedAt(Instant.now());
        return r;
    }

    public RatingResponseDto toDto(Ratings r) {
        return RatingResponseDto.builder()
            .ratingId(r.getRatingId())
            .userId(r.getUser().getUserId())
            .targetType(r.getTargetType())
            .targetId(r.getTargetId())
            .ratingValue(r.getRatingValue())
            .comment(r.getComment())
            .ratedAt(r.getRatedAt())
            .build();
    }
        
}

