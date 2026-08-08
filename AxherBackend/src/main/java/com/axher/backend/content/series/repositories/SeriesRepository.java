package com.axher.backend.content.series.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.series.entities.Series;

public interface SeriesRepository extends JpaRepository<Series, Integer> {

    @Query("""
        SELECT s
        FROM Series s
        JOIN FETCH s.content c
        WHERE c.contentId = :contentId
        AND c.type = 'SERIE'
        AND c.contentStatus.code = 'PUBLISHED'
        """)
    Optional<Series> findPublicByContentId(Integer contentId);

}
