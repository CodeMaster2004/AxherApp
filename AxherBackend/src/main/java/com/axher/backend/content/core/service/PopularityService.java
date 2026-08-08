package com.axher.backend.content.core.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.DTOs.TopRatedContentDto;
import com.axher.backend.content.core.DTOs.TrendingContentDto;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.playback.repositories.PlaybackHistoryRepository;
import com.axher.backend.content.ratings.repositories.RatingsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PopularityService {

    private final PlaybackHistoryRepository repository;
    private final RatingsRepository ratingsRepository;


    public Page<TrendingContentDto> trending(ContentTypeEnum type, Pageable pageable){

        LocalDateTime date = LocalDateTime.now().minusDays(7);

        return repository.findTrending(date, type, pageable);
    }


    public List<TopRatedContentDto> topRated(ContentTypeEnum type) {

        List<TopRatedContentDto> list = ratingsRepository.findTopRated(type);

        Double globalAverage = ratingsRepository.findGlobalAverage();

        double avgGlobal = globalAverage == null ? 0 : globalAverage;

        int MIN_VOTES = 1;

        list.forEach(dto -> {

            double v = dto.getTotalRatings();
            double r = dto.getAverageRating();
            double score =
                ((v/(v+MIN_VOTES))*r)
                +
                ((MIN_VOTES/(v+MIN_VOTES))*avgGlobal);

            dto.setScore(score);
        });

        return list.stream()
            .sorted(
                Comparator.comparing(
                    TopRatedContentDto::getScore
                ).reversed()
            )
            .limit(10)
            .toList();
    }
        
}

