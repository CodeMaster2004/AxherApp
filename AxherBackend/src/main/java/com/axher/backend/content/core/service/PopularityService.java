package com.axher.backend.content.core.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.TopRatedContentResult;
import com.axher.backend.content.core.DTOs.TrendingContentResult;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.playback.repositories.PlaybackHistoryRepository;
import com.axher.backend.content.ratings.repositories.RatingsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PopularityService {

    private final PlaybackHistoryRepository repository;
    private final RatingsRepository ratingsRepository;


    public Page<TrendingContentResult> trending(ContentTypeEnum type, Pageable pageable){

        Instant date = Instant.now().minus(7, ChronoUnit.DAYS);

        return repository.findTrending(date, type, pageable);
    }


    public List<TopRatedContentResult> topRated(ContentTypeEnum type) {

        List<TopRatedContentResult> list =
            ratingsRepository.findTopRated(type);

        Double globalAverage =
            ratingsRepository.findGlobalAverage();

        double avgGlobal =
            globalAverage == null ? 0 : globalAverage;

        int MIN_VOTES = 1;

        return list.stream()
            .map(result -> {

                double v = result.totalRatings();
                double r = result.averageRating();

                double score =
                    ((v / (v + MIN_VOTES)) * r)
                    +
                    ((MIN_VOTES / (v + MIN_VOTES)) * avgGlobal);

                return new TopRatedContentResult(
                    result.content(),
                    result.averageRating(),
                    result.totalRatings(),
                    score
                );
            })
            .sorted(
                Comparator.comparing(
                    TopRatedContentResult::score
                ).reversed()
            )
            .limit(10)
            .toList();
    }
        
}

