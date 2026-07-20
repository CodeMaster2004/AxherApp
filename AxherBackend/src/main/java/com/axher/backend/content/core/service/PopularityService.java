package com.axher.backend.content.core.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.ContentFeaturedDto;
import com.axher.backend.content.core.DTOs.PopularContentDto;
import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.playback.repositories.PlaybackHistoryRepository;
import com.axher.backend.content.ratings.repositories.RatingsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PopularityService {

    private final PlaybackHistoryRepository repository;
    private final RatingsRepository ratingsRepository;

    // Para hero banner
    public List<ContentFeaturedDto> featuredTrending(){

        LocalDateTime date =
                LocalDateTime.now().minusDays(7);

        Pageable pageable = Pageable.ofSize(5);

        return repository.findFeaturedTrending(
                date,
                pageable
        );
    }

    public Page<PopularContentDto> trending(Pageable pageable){

        LocalDateTime date = LocalDateTime.now().minusDays(7);

        return repository.findTrending(date, pageable);
    }

    public Page<PopularContentDto> mostWatchedMovies(Pageable pageable){

        LocalDateTime date = LocalDateTime.now().minusDays(30);

        return repository.findMostWatchedMovies(date, pageable);
    }

    public Page<PopularContentDto> mostWatchedSeries(Pageable pageable){

        LocalDateTime date = LocalDateTime.now().minusDays(30);

        return repository.findMostWatchedSeries(date, pageable);
    }

    public TopRatedContentDto topRated() {
        List<TopRatedContentDto> list = ratingsRepository.findTopRated();
        if (list.isEmpty()) return null;

        Double globalAverage = ratingsRepository.findGlobalAverage();
        double avgGlobal = (globalAverage == null) ? 0.0 : globalAverage;
        final int MIN_VOTES = 20; // Súbelo para más calidad

        for (TopRatedContentDto dto : list) {
            double v = dto.getTotalRatings();
            double r = dto.getAverageRating();
            
            // Fórmula Bayesiana: ((v / (v+m)) * r) + ((m / (v+m)) * C)
            double score = ((v / (v + MIN_VOTES)) * r) + ((MIN_VOTES / (v + MIN_VOTES)) * avgGlobal);
            dto.setScore(score);
        }

        // Ordenar y devolver el mejor
        return list.stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore())) // DESCENDENTE
                .findFirst()
                .orElse(null);
    }
        
}

