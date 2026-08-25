package com.axher.backend.content.playback.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.catalog.banner.DTOs.HeroPlaybackMetricsDto;
import com.axher.backend.content.core.DTOs.ContentFeaturedDto;
import com.axher.backend.content.core.DTOs.TrendingContentResult;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.playback.entities.PlaybackHistory;


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
    SELECT new com.axher.backend.content.core.DTOs.TrendingContentResult(
            c,
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
        GROUP BY c
        ORDER BY
            (
                COUNT(DISTINCT ph.user.userId) * 10.0
                +
                COUNT(ph.playbackHistoryId) * 3.0
                +
                SUM(ph.watchedSeconds) / 60.0
            ) DESC
    """)
    Page<TrendingContentResult> findTrending(
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
