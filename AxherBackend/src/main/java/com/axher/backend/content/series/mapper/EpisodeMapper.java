package com.axher.backend.content.series.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.mapper.ContentStatusMapper;
import com.axher.backend.content.core.service.ContentLocalizationService;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.service.EpisodeLocalizationService;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class EpisodeMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    private final ContentStatusMapper contentStatusMapper;
    private final EpisodeLocalizationService episodeLocalizationService;
    private final ContentLocalizationService contentLocalizationService;

    public EpisodeResponseDto toDto(Episodes episode){
        
        EpisodeResponseDto dto = new EpisodeResponseDto();

        EpisodeLocalizationService.LocalizedEpisode localized =
                episodeLocalizationService.resolve(episode);


        dto.setEpisodeId(episode.getEpisodeId());
        dto.setEpisodeNumber(episode.getEpisodeNumber());
        dto.setTitle(localized.title());
        dto.setDescription(localized.description());
        dto.setDurationSeconds(episode.getDurationSeconds());
        dto.setThumbnailUrl(buildUrl(episode.getThumbnailUrl()));
        dto.setEpisodeUrl(buildUrl(episode.getEpisodeUrl()));
        dto.setReleaseDate(episode.getReleaseDate());
        dto.setStatus(
            contentStatusMapper.toDto(episode.getContentStatus())
        );
        // ==========================================
        // TEMPORADA
        // ==========================================

        if (episode.getSeason() != null) {

            dto.setSeasonNumber(
                    episode.getSeason()
                            .getSeasonNumber()
            );


            // ==========================================
            // SERIE
            // ==========================================

            if (episode.getSeason().getSeries() != null
                    && episode.getSeason()
                            .getSeries()
                            .getContent() != null) {

                var seriesContent =
                        episode.getSeason()
                                .getSeries()
                                .getContent();


                ContentLocalizationService.LocalizedContent
                        localizedSeries =
                            contentLocalizationService
                                    .resolve(seriesContent);


                dto.setSeriesTitle(
                        localizedSeries.title()
                );
            }
        }

        
        return dto;
    }


    private String buildUrl(String path){
        if(path == null){
            return null;
        }
        return baseUrl + path;
    }
    
}

