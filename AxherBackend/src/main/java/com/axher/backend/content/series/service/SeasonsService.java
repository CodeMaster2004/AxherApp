package com.axher.backend.content.series.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.quartz.SchedulerException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusCode;
import com.axher.backend.content.core.service.ContentStatusService;
import com.axher.backend.content.series.DTOs.seasonDTOs.CreateSeasonRequestDto;
import com.axher.backend.content.series.DTOs.seasonDTOs.UpdateSeasonRequestDto;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.entities.Series;
import com.axher.backend.content.series.repositories.SeasonsRepository;
import com.axher.backend.infrastructure.quartz.SeasonPublicationScheduler;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SeasonsService {
    
    private final SeasonsRepository seasonsRepository;
    private final SeriesService seriesService;
    private final FileStorageService fileStorageService;
    private final SeasonPublicationScheduler seasonPublicationScheduler;
    private final ContentStatusService statusService;

    @Transactional(readOnly = true)
    public Page<Seasons> findBySeriesId(Integer seriesId, Pageable pageable){
        return seasonsRepository.findBySeries_ContentId(seriesId, pageable);
    }

    @Transactional(readOnly = true)
    public Seasons findById(Integer seasonId){
        return seasonsRepository.findById(seasonId)
            .orElseThrow(() -> new ResourceNotFoundException("Temporada no encontrada: " + seasonId));
    }

    /*@Transactional(readOnly = true)
    public Seasons findPublicBySeriesIdAndSeasonId(Integer seriesId, Integer seasonId) {

        Seasons season = findBySeriesIdAndSeasonId(seriesId, seasonId);

        if(!"PUBLISHED".equalsIgnoreCase(
            season.getSeries()
                .getContent()
                .getContentStatus()
                .getStatus()   
        )){
            throw new ResourceNotFoundException("Serie no disponible");
        }

        if(!"PUBLISHED".equalsIgnoreCase(
            season.getContentStatus().getStatus()
        )){
            throw new ResourceNotFoundException("Temporada no disponible");
        }
        return season;
    }*/

    public Page<Seasons> findPublicBySeriesId(Integer seriesId, Pageable pageable){

        return seasonsRepository.findPublicBySeriesId(seriesId, pageable);
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

    public List<Seasons> findUpcoming(Integer seriesId) {
        return seasonsRepository
            .findBySeries_ContentIdAndContentStatus_CodeOrderByReleaseDateAsc(
                seriesId,
                ContentStatusCode.UPCOMING.name()
            );
    }

    public void publish(Integer id) {

        Seasons season = findById(id);

        if(ContentStatusCode.PUBLISHED.name().equals(season.getContentStatus().getCode())){
            log.info("La temporada {} ya estaba publicado. Se omite la publicación.", id);
            return;
        }

        Content content = season.getSeries().getContent();

        if(!ContentStatusCode.PUBLISHED.name().equals(content.getContentStatus().getCode())){
            throw new IllegalStateException("No se puede publicar la temporada porque la serie no está publicada");
        }



        ContentStatus published = statusService.getStatus(ContentStatusCode.PUBLISHED);

        season.setContentStatus(published);
        seasonsRepository.save(season);

        log.info("Temporada {} publicada correctamente", id);
    }

    public Seasons create(Integer seriesId, CreateSeasonRequestDto dto){

        Series series = seriesService.findById(seriesId);

        ContentStatus defaultStatus = statusService.getStatus(ContentStatusCode.DRAFT);

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
        season.setContentStatus(defaultStatus);
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

        if(dto.getStatusId() != null){
            ContentStatus status = statusService.findById(dto.getStatusId());
            season.setContentStatus(status);
        }

        Seasons saved = seasonsRepository.save(season);

        try {
            syncPublication(saved);
        }catch (Exception e) {
            throw new IllegalStateException("Error al sincronizar la publicación de la temporada", e);
        }
        
        return saved;
    }

    @Transactional
    public Seasons updateStatus(Integer seriesId, Integer seasonId, Integer statusId){

        Seasons season = findBySeriesIdAndSeasonId(seriesId, seasonId);

        ContentStatus status = statusService.findById(statusId);

        season.setContentStatus(status);

        Seasons saved = seasonsRepository.save(season);

        try {
            syncPublication(saved);
        }catch (Exception e) {
            throw new IllegalStateException("Error al programar la publicación de la temporada", e);
        }

        return saved;
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
        try{
            seasonPublicationScheduler.cancel(season.getSeasonId());
        }catch (Exception e) {
            throw new IllegalStateException("Error al cancelar la publicacion de la temporada", e);
        }
        seasonsRepository.delete(season);
    }


    private void syncPublication(Seasons season) throws SchedulerException {
        
        if(ContentStatusCode.UPCOMING.name().equals(season.getContentStatus().getCode())){

            if(season.getReleaseDate() == null) {
                throw new IllegalArgumentException("La temporada UPCOMING necesita fecha de estreno");
            }

            if(season.getReleaseDate().isBefore(LocalDateTime.now())){
                throw new IllegalArgumentException("La fecha de estreno debe ser futura");
            }

            seasonPublicationScheduler.schedule(
                season.getSeasonId(),
                season.getReleaseDate()
            );
        }else {
            
            seasonPublicationScheduler.cancel(season.getSeasonId());
        }
    }
}

