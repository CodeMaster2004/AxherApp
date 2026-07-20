package com.axher.backend.content.series.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.content.series.DTOs.seasonDTOs.CreateSeasonRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.UpdateSeasonRequestDto;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.entities.Series;
import com.axher.backend.content.series.repositories.SeasonsRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SeasonsService {
    
    private final SeasonsRepository seasonsRepository;
    private final SeriesService seriesService;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<Seasons> findBySeriesId(Integer seriesId, Pageable pageable){
        return seasonsRepository.findBySeries_ContentId(seriesId, pageable);
    }

    @Transactional(readOnly = true)
    public Seasons findById(Integer seasonId){
        return seasonsRepository.findById(seasonId)
            .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada: " + seasonId));
    }

    @Transactional(readOnly = true)
    public Seasons findBySeriesIdAndSeasonId(Integer seriesId, Integer seasonId){
        return seasonsRepository
            .findBySeasonIdAndSeries_ContentId(seasonId, seriesId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Temporada no encontrada para la serie: " + seriesId
            ));
    }

    @Transactional
    public List<Seasons> findBySeriesIdAndReleaseDateBetween (Integer seriesId, LocalDate start, LocalDate end){
        return seasonsRepository.findBySeries_ContentIdAndReleaseDateBetween(seriesId, start, end);
    }

    @Transactional(readOnly = true)
    public List<Seasons> searchByTitle(Integer seriesId, String keyword){
        return seasonsRepository.findBySeries_ContentIdAndTitleContainingIgnoreCase(seriesId, keyword);
    }

    public Seasons create(Integer seriesId, CreateSeasonRequestDto dto){

        Series series = seriesService.findById(seriesId);

        boolean exists = seasonsRepository
            .existsBySeries_ContentIdAndSeasonNumber(seriesId, dto.getSeasonNumber());

        if(exists){
            throw new IllegalArgumentException("Ya existe una temporada con ese número");
        }

        Seasons season = new Seasons();
        season.setSeasonNumber(dto.getSeasonNumber());
        season.setTitle(dto.getTitle());
        season.setDescription(dto.getDescription());
        season.setReleaseDate(dto.getReleaseDate());
        season.setSeries(series);

        return seasonsRepository.save(season);
    }

    public Seasons update(Integer seriesId, Integer seasonId, UpdateSeasonRequestDto dto){
        Seasons season = findBySeriesIdAndSeasonId(seriesId,seasonId);

        if(dto.getSeasonNumber() != null){
        // Validar que no exista otro season con ese número
            boolean exists = seasonsRepository.existsBySeries_ContentIdAndSeasonNumberAndSeasonIdNot(
                seriesId, dto.getSeasonNumber(), seasonId
            );
            if(exists){
                throw new IllegalArgumentException("Ya existe otra temporada con ese número en la serie");
            }
            season.setSeasonNumber(dto.getSeasonNumber());
        }

        if(dto.getTitle() != null){
            season.setTitle(dto.getTitle());
        }

        if(dto.getDescription() != null){
            season.setDescription(dto.getDescription());
        }

        if(dto.getReleaseDate() != null){
            season.setReleaseDate(dto.getReleaseDate());
        }
        return seasonsRepository.save(season);
    }

    public void delete(Integer seriesId, Integer seasonId){
        Seasons season = findBySeriesIdAndSeasonId(seriesId, seasonId);
        if(season.getEpisodes() != null){
            season.getEpisodes().forEach(ep -> {
                if(ep.getEpisodeUrl() != null){
                    fileStorageService.deleteFile(ep.getEpisodeUrl());
                }
            });
        }
        seasonsRepository.delete(season);
    }
}

