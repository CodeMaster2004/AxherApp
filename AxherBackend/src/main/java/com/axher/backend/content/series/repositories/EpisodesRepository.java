package com.axher.backend.content.series.repositories;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.series.entities.Episodes;

public interface EpisodesRepository extends JpaRepository<Episodes, Integer> {
    Page<Episodes> findBySeason_SeasonId(Integer seasonId, Pageable pageable);

    boolean existsBySeason_SeasonIdAndEpisodeNumber(Integer seasonId, Integer episodeNumber);

    boolean existsBySeason_SeasonIdAndEpisodeNumberAndEpisodeIdNot(Integer seasonId, Integer episodeNumber, Integer episodeId);

    // ✅ Buscar episodios por rango de fecha
    List<Episodes> findBySeason_SeasonIdAndReleaseDateBetween(Integer seasonId, LocalDate start, LocalDate end);

    // ✅ Buscar episodios por título (case-insensitive)
    List<Episodes> findBySeason_SeasonIdAndTitleContainingIgnoreCase(Integer seasonId, String keyword);

    Optional<Episodes> findByEpisodeIdAndSeason_SeasonId(Integer episodeId, Integer seasonId);// Para validar que el episodio pertenece a la temporada al actualizar o eliminar

    List<Episodes> findByContentStatus_CodeAndReleaseDateLessThanEqual(
        String code,
        LocalDateTime releaseDate
    );

    Page<Episodes> findByContentStatus_CodeOrderByReleaseDateAsc(
        String code,
        Pageable pageable
    );

    @Query("""
    SELECT e
    FROM Episodes e
    WHERE e.season.seasonId = :seasonId
    AND e.season.contentStatus.code='PUBLISHED'
    AND e.season.series.content.contentStatus.code='PUBLISHED'
    AND e.contentStatus.code='PUBLISHED'
    """)
    Page<Episodes> findPublicBySeasonId(
            Integer seasonId,
            Pageable pageable
    );
        
}
