package com.axher.backend.catalog.banner.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.catalog.banner.DTOs.HeroCandidateMetricsDto;
import com.axher.backend.catalog.banner.DTOs.HeroPlaybackMetricsDto;
import com.axher.backend.catalog.banner.DTOs.HeroRatingMetricsDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.playback.repositories.PlaybackHistoryRepository;
import com.axher.backend.content.ratings.repositories.RatingsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HeroMetricsService {

    private final PlaybackHistoryRepository playbackHistoryRepository;
    private final RatingsRepository ratingsRepository;
    private final ContentRepository contentRepository;

    public List<HeroCandidateMetricsDto> getCandidates() {

        LocalDateTime from = LocalDateTime.now().minusDays(7);
        List<HeroPlaybackMetricsDto> playbackMetrics = playbackHistoryRepository.findHeroPlaybackMetrics(from);
        List<HeroRatingMetricsDto> ratingMetrics = ratingsRepository.findHeroRatingMetrics();

        Map<Integer, HeroPlaybackMetricsDto> playbackMap = 
                playbackMetrics.stream()
                        .collect(Collectors.toMap(
                            HeroPlaybackMetricsDto::getContentId,
                            Function.identity()
                        ));
        Map<Integer, HeroRatingMetricsDto> ratingMap =
                ratingMetrics.stream()
                        .collect(Collectors.toMap(
                            HeroRatingMetricsDto::getContentId,
                            Function.identity()
                        ));
        List<Content> contents =
        contentRepository.findByContentStatus_Code("PUBLISHED");
        
        return contents.stream()
                
                .map(content -> {

                    Integer contentId = content.getContentId();
                    HeroPlaybackMetricsDto playback = playbackMap.get(contentId);
                    HeroRatingMetricsDto rating = ratingMap.get(contentId);

                    return new HeroCandidateMetricsDto(
                        contentId,
                        playback != null
                            ? playback.getTotalViews7d()
                            : 0L,
                        playback != null
                            ? playback.getUniqueUsers7d()
                            : 0L,
                        rating != null
                            ? rating.getAverageRating()
                            : 0.0,
                        rating != null
                            ? rating.getTotalRatings()
                            : 0L,

                        content.getReleaseDate() != null
                        ? content.getReleaseDate().toLocalDate()
                        : null
                    );
                })
                .toList();
    }
    
}
