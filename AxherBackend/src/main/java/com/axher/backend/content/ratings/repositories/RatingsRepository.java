package com.axher.backend.content.ratings.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.ratings.entities.Ratings;
import com.axher.backend.content.ratings.entities.TargetTypeEnum;

import io.lettuce.core.dynamic.annotation.Param;

public interface RatingsRepository extends JpaRepository<Ratings, Integer>{

    Page<Ratings> findByUser_UserId(Integer userId, Pageable pageable);
    Page<Ratings> findByTargetType(TargetTypeEnum targetType, Pageable pageable);
    Page<Ratings> findByTargetTypeAndTargetId(TargetTypeEnum targetType, Integer targetId, Pageable pageable);
    Optional<Ratings> findByUser_UserIdAndTargetTypeAndTargetId(
            Integer userId,
            TargetTypeEnum targetType,
            Integer targetId
    );

    @Query("""
        SELECT AVG(r.ratingValue)
        FROM Ratings r
        WHERE r.targetType = :type
        AND r.targetId = :targetId
    """)
    Double findAverageRating(
            @Param("type") TargetTypeEnum type,
            @Param("targetId") Integer targetId
    );

    Long countByTargetTypeAndTargetId(
            TargetTypeEnum type,
            Integer targetId
    );

    @Query("""
        SELECT AVG(r.ratingValue)
        FROM Ratings r
        WHERE r.targetType = 'CONTENT'
        """)
        Double findGlobalAverage();

    @Query("""
        SELECT new com.axher.backend.content.core.DTOs.TopRatedContentDto(
                c.contentId,
                c.title,
                c.description,
                c.backdropUrl,
                c.trailerUrl,
                c.type,
                AVG(r.ratingValue),
                COUNT(r)
        )
        FROM Ratings r, Content c
        WHERE r.targetType = 'CONTENT'
        AND r.targetId = c.contentId
        GROUP BY
                c.contentId,
                c.title,
                c.description,
                c.backdropUrl,
                c.trailerUrl,
                c.type
        """)
        List<TopRatedContentDto> findTopRated();

      

    
}
