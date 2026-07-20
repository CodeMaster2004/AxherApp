package com.axher.backend.content.playback.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.content.core.DTOs.ContentFeaturedDto;
import com.axher.backend.content.core.DTOs.PopularContentDto;
import com.axher.backend.content.playback.entities.PlaybackHistory;

import io.lettuce.core.dynamic.annotation.Param;

public interface PlaybackHistoryRepository extends JpaRepository<PlaybackHistory, Integer> {

    Optional<PlaybackHistory> findByUser_UserIdAndContent_ContentIdAndEpisodeIsNull(
        Integer userId,
        Integer contentId
    );

    Optional<PlaybackHistory> findByUser_UserIdAndEpisode_EpisodeId(
        Integer userId,
        Integer episodeId
    );

    List<PlaybackHistory> findTop20ByUser_UserIdOrderByWatchedAtDesc(Integer userId);

    @Query("""
    SELECT new com.axher.backend.content.core.DTOs.PopularContentDto(
        c.contentId,
        c.title,
        c.posterUrl,
        SUM(ph.watchedSeconds)
    )
    FROM PlaybackHistory ph
    JOIN ph.content c
    WHERE ph.watchedAt >= :date
    GROUP BY
        c.contentId,
        c.title,
        c.posterUrl
    ORDER BY SUM(ph.watchedSeconds) DESC
    """)
    Page<PopularContentDto> findTrending(
        @Param("date") LocalDateTime date,
        Pageable pageable
    );

    @Query("""
    SELECT new com.axher.backend.content.core.DTOs.PopularContentDto(
        c.contentId,
        c.title,
        c.posterUrl,
        SUM(ph.watchedSeconds)
    )
    FROM PlaybackHistory ph
    JOIN ph.content c
    WHERE ph.watchedAt >= :date
    AND c.type = 'MOVIE'
    GROUP BY
        c.contentId,
        c.title,
        c.posterUrl
    ORDER BY SUM(ph.watchedSeconds) DESC
    """)
    Page<PopularContentDto> findMostWatchedMovies(
        @Param("date") LocalDateTime date,
        Pageable pageable
    );

    @Query("""
    SELECT new com.axher.backend.content.core.DTOs.PopularContentDto(
        c.contentId,
        c.title,
        c.posterUrl,
        SUM(ph.watchedSeconds)
    )
    FROM PlaybackHistory ph
    JOIN ph.content c
    WHERE ph.watchedAt >= :date
    AND c.type = 'SERIE'
    GROUP BY
        c.contentId,
        c.title,
        c.posterUrl
    ORDER BY SUM(ph.watchedSeconds) DESC
    """)
    Page<PopularContentDto> findMostWatchedSeries(
        @Param("date") LocalDateTime date,
        Pageable pageable
    );

    @Query("""
    SELECT new com.axher.backend.content.core.DTOs.ContentFeaturedDto(
        c.contentId,
        c.title,
        c.backdropUrl,
        c.description,
        c.trailerUrl,
        c.type
    )
    FROM PlaybackHistory ph
    JOIN ph.content c
    WHERE ph.watchedAt >= :date
    GROUP BY
        c.contentId,
        c.title,
        c.backdropUrl,
        c.description,
        c.trailerUrl,
        c.type
    ORDER BY
        COUNT(DISTINCT ph.user.userId) * 10 
        + SUM(ph.watchedSeconds) DESC
    """)
    List<ContentFeaturedDto> findFeaturedTrending(
        @Param("date") LocalDateTime date,
        Pageable pageable
    );
}
