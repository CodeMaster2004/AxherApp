package com.axher.backend.content.series.repositories;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.series.entities.Seasons;

public interface SeasonsRepository extends JpaRepository<Seasons, Integer> {
    // Obtener todas las temporadas por id de la serie
    Page<Seasons> findBySeries_ContentId(Integer contentId, Pageable pageable); 

    // Validar si ya existe una temporada con ese número en la serie
    boolean existsBySeries_ContentIdAndSeasonNumber(Integer contentId, Integer seasonNumber);

    List<Seasons> findBySeries_ContentIdAndReleaseDateBetween(Integer contentId, LocalDate start, LocalDate end);

    @Query("""
        SELECT DISTINCT s
        FROM Seasons s
        JOIN s.translations t
        WHERE s.series.content.contentId = :seriesId
        AND LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    List<Seasons> searchByTitle(
        Integer seriesId,
        String keyword
    );

    Optional<Seasons> findBySeasonIdAndSeries_ContentId(Integer seasonId, Integer seriesId);

    boolean existsBySeries_ContentIdAndSeasonNumberAndSeasonIdNot(Integer seriesId, Integer seasonNumber, Integer seasonId);

    List<Seasons> findByContentStatus_CodeAndReleaseDateLessThanEqual(
        String code,
        LocalDateTime releaseDate
    );

    List<Seasons> findBySeries_ContentIdAndContentStatus_CodeOrderByReleaseDateAsc(
        Integer seriesId,
        String code
    );

    @Query("""
    SELECT s
    FROM Seasons s
    WHERE s.series.content.contentId = :seriesId
    AND s.series.content.contentStatus.code='PUBLISHED'
    AND s.contentStatus.code='PUBLISHED'
    """)
    Page<Seasons> findPublicBySeriesId(
            Integer seriesId,
            Pageable pageable
    );
}

