package com.axher.backend.catalog.banner.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.catalog.banner.DTOs.HeroCandidateMetricsDto;
import com.axher.backend.catalog.banner.DTOs.HeroRankedCandidateDto;
import com.axher.backend.content.ratings.repositories.RatingsRepository;
import com.axher.backend.shared.util.RatingUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HeroRankingService {

    private static final double VIEWS_WEIGHT = 0.35;
    private static final double USERS_WEIGHT = 0.20;
    private static final double RATING_WEIGHT = 0.20;
    private static final double RECENCY_WEIGHT = 0.25;

    private static final int MINIMUM_RATINGS = 1;

    private final HeroMetricsService heroMetricsService;
    private final RatingsRepository ratingsRepository;

    public List<HeroRankedCandidateDto> rank() {

        List<HeroCandidateMetricsDto> candidates = heroMetricsService.getCandidates();

        long maxViews = candidates.stream()
                .mapToLong(HeroCandidateMetricsDto::getTotalViews7d)
                .max()
                .orElse(0);
        long maxUsers = candidates.stream()
                .mapToLong(HeroCandidateMetricsDto::getUniqueUsers7d)
                .max()
                .orElse(0);

        Double globalAverage = ratingsRepository.findGlobalAverage();

        double avgGlobal = globalAverage != null
                ? globalAverage
                : 0.0;

        return candidates.stream()
                .map(candidate -> 
                        new HeroRankedCandidateDto(
                            candidate.getContentId(),
                            calculateScore(
                                candidate,
                                maxViews,
                                maxUsers,
                                avgGlobal
                            ),
                            candidate
                        )
                )
                .sorted(
                    Comparator.comparing(
                        HeroRankedCandidateDto::getScore
                    ).reversed()
                )
                .limit(10)
                .toList();
    }

    private double calculateScore(HeroCandidateMetricsDto candidate, long maxViews, long maxUsers, double globalAverage) {

        double viewsScore = normalizeLog(candidate.getTotalViews7d(), maxViews);
        double usersScore = normalizeLog(candidate.getUniqueUsers7d(), maxUsers);
        double bayesianRating = RatingUtils.bayesianRating(
            candidate.getAverageRating(),
            candidate.getTotalRatings(),
            globalAverage,
            MINIMUM_RATINGS
        );

        double ratingScore = bayesianRating / 5.0;

        double recencyScore = calculateRecencyScore(candidate);
        return
            viewsScore * VIEWS_WEIGHT
            +
            usersScore * USERS_WEIGHT
            +
            ratingScore * RATING_WEIGHT
            +
            recencyScore * RECENCY_WEIGHT;
    }

    private double normalizeLog(long value, long maxValue) {
        if (value <= 0 || maxValue <= 0) {
            return 0.0;
        }
        return Math.log1p(value) / Math.log1p(maxValue);
    }

    private double calculateRecencyScore(HeroCandidateMetricsDto candidate){

        if(candidate.getReleaseDate() == null){
            return 0.0;
        }

        long days = java.time.temporal.ChronoUnit.DAYS.between(
            candidate.getReleaseDate(),
            java.time.LocalDate.now()
        );

        if(days <= 0){
            return 1.0;
        }

        return Math.exp(-days / 30.0);
    }
    
}
