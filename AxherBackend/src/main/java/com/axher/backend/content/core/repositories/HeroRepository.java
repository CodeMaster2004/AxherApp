package com.axher.backend.content.core.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.core.DTOs.HeroContentDto;
import com.axher.backend.content.core.entities.Content;


public interface HeroRepository extends JpaRepository<Content, Integer>{

@Query("""
    SELECT new com.axher.backend.content.core.DTOs.HeroContentDto(
        c.contentId,
        c.title,
        c.description,
        c.backdropUrl,
        c.trailerUrl,
        c.type,
        null,

        (
            COUNT(DISTINCT ph.playbackHistoryId) * 0.5
            +
            COALESCE(AVG(r.ratingValue),0.0) * 10
        ),

        COALESCE(AVG(r.ratingValue),0.0),

        COUNT(DISTINCT ph.playbackHistoryId)
    )

    FROM Content c

    LEFT JOIN PlaybackHistory ph
    ON ph.content.contentId = c.contentId

    LEFT JOIN Ratings r
    ON r.targetId = c.contentId
    AND r.targetType='CONTENT'

    GROUP BY
    c.contentId,
    c.title,
    c.description,
    c.backdropUrl,
    c.trailerUrl,
    c.type

    ORDER BY
    (
    COUNT(DISTINCT ph.playbackHistoryId) * 0.5
    +
    COALESCE(AVG(r.ratingValue),0.0) * 10
    ) DESC
    """)
    List<HeroContentDto> findHeroRanking(Pageable pageable);


    
}
