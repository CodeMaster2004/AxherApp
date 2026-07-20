package com.axher.backend.content.series.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.series.DTOs.EpisodesDTOs.EpisodeResponseDto;
import com.axher.backend.content.series.DTOs.SeriesDTOs.SeriesDetailResponseDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.SeasonResponseDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.entities.Series;

@Component
public class SeriesMapper {

    @Value("${app.base-url}")
    private String baseUrl;

    public SeriesDetailResponseDto toDto(Series series){
        if(series == null || series.getContent() == null) {
            return null;
        }

        SeriesDetailResponseDto dto = new SeriesDetailResponseDto();

        dto.setContentId(series.getContent().getContentId());
        dto.setTitle(series.getContent().getTitle());
        dto.setDescription(series.getContent().getDescription());
        dto.setPosterUrl(buildUrl(series.getContent().getPosterUrl()));
        dto.setTrailerUrl(buildUrl(series.getContent().getTrailerUrl()));
        dto.setPrice(series.getContent().getPrice());

        //Categorias
        dto.setCategories(
            series.getContent().getCategories()
                .stream()
                .map(c -> c.getName())
                .collect(Collectors.toList())
        );

        //Status
        dto.setStatus(
            series.getContent().getContentStatus() != null
                ? series.getContent().getContentStatus().getStatus()
                : null
        );

        // Descuento
        dto.setDiscountAmount(
            series.getContent().getDiscount() != null
                ? series.getContent().getDiscount().getAmount()
                : null
        );

        dto.setRegisteredAt(series.getContent().getRegisteredAt());

        if(series.getSeasons() != null) {
            dto.setSeasons(
                series.getSeasons()
                    .stream()
                    .map(this::mapSeason)
                    .collect(Collectors.toList())
            );
        }

        return dto;
    }

    //=======================================
    // Métodos auxiliares para mapear temporadas y episodios
    //=======================================

    private SeasonResponseDto mapSeason(Seasons season){
        SeasonResponseDto seasonDto = new SeasonResponseDto();
        seasonDto.setSeasonId(season.getSeasonId());
        seasonDto.setSeasonNumber(season.getSeasonNumber());
        seasonDto.setTitle(season.getTitle());
        seasonDto.setDescription(season.getDescription());
        seasonDto.setReleaseDate(season.getReleaseDate());

        if(season.getEpisodes() != null){
            seasonDto.setEpisodes(
                season.getEpisodes()
                    .stream()
                    .map(this::mapEpisode)
                    .collect(Collectors.toList())
            );
        }

        return seasonDto;
    }

    private EpisodeResponseDto mapEpisode(Episodes episode){
        EpisodeResponseDto episodeDto = new EpisodeResponseDto();
        episodeDto.setEpisodeId(episode.getEpisodeId());
        episodeDto.setEpisodeNumber(episode.getEpisodeNumber());
        episodeDto.setTitle(episode.getTitle());
        episodeDto.setDescription(episode.getDescription());
        episodeDto.setDurationSeconds(episode.getDurationSeconds());
        episodeDto.setThumbnailUrl(buildUrl(episode.getThumbnailUrl()));
        episodeDto.setEpisodeUrl(buildUrl(episode.getEpisodeUrl()));
        episodeDto.setReleaseDate(episode.getReleaseDate());

          episodeDto.setSeasonNumber(
            episode.getSeason().getSeasonNumber()
        );


        episodeDto.setSeriesTitle(
            episode.getSeason()
                .getSeries()
                .getContent()
                .getTitle()
        );
        return episodeDto;
    }

    private String buildUrl(String path){
        if(path == null) return null;
        return baseUrl + path;
    }
}

