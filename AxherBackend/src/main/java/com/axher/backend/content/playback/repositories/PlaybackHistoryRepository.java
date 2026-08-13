package com.axher.backend.content.playback.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.catalog.banner.DTOs.HeroPlaybackMetricsDto;
import com.axher.backend.content.core.DTOs.ContentFeaturedDto;
import com.axher.backend.content.core.DTOs.TrendingContentDto;
import com.axher.backend.content.core.entities.ContentTypeEnum;
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
    SELECT new com.axher.backend.content.core.DTOs.TrendingContentDto(

        c.contentId,
        c.title,
        c.posterUrl,
        c.type,

        COUNT(ph.playbackHistoryId),

        COUNT(DISTINCT ph.user.userId),

        SUM(ph.watchedSeconds),

        (
            COUNT(DISTINCT ph.user.userId) * 10.0
            +
            COUNT(ph.playbackHistoryId) * 3.0
            +
            SUM(ph.watchedSeconds) / 60.0
        )

    )

    FROM PlaybackHistory ph

    JOIN ph.content c

    WHERE ph.watchedAt >= :date
    AND (:type IS NULL OR c.type = :type)

    GROUP BY
        c.contentId,
        c.title,
        c.posterUrl,
        c.type

    ORDER BY

    (
        COUNT(DISTINCT ph.user.userId) * 10.0
        +
        COUNT(ph.playbackHistoryId) * 3.0
        +
        SUM(ph.watchedSeconds) / 60.0

    ) DESC

    """)
    Page<TrendingContentDto> findTrending(
        @Param("date") LocalDateTime date,
        @Param("type") ContentTypeEnum type,
        Pageable pageable
    );

    @Query("""
    SELECT ph
    FROM PlaybackHistory ph

    JOIN FETCH ph.content c

    LEFT JOIN FETCH c.movie m

    LEFT JOIN FETCH ph.episode e

    LEFT JOIN FETCH e.season s

    WHERE ph.user.userId = :userId

    AND ph.watchedSeconds > 0

    ORDER BY ph.watchedAt DESC

    """)
    List<PlaybackHistory> findContinueWatching(
        @Param("userId") Integer userId,
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
    List<ContentFeaturedDto> findFeatured(
        @Param("date") LocalDateTime date,
        Pageable pageable
    );

    @Query("""
        SELECT new com.axher.backend.catalog.banner.DTOs.HeroPlaybackMetricsDto(
            ph.content.contentId,
            COUNT(ph.playbackHistoryId),
            COUNT(DISTINCT ph.user.userId)
        )
        FROM PlaybackHistory ph
        WHERE ph.content IS NOT NULL
        AND ph.watchedAt >= :from
        GROUP BY ph.content.contentId
        """)
    List<HeroPlaybackMetricsDto> findHeroPlaybackMetrics(
            @Param("from") LocalDateTime from
    );
}
