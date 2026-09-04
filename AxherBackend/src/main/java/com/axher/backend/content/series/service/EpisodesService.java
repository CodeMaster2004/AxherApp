package com.axher.backend.content.series.service;

import java.time.Instant;
import java.time.LocalDate;
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
import com.axher.backend.content.media.service.VideoMetadataService;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.CreateEpisodeRequestDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpdateEpisodeRequestDto;
import com.axher.backend.content.series.entities.EpisodeTranslation;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.repositories.EpisodeTranslationRepository;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.infrastructure.quartz.EpisodePublicationScheduler;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class EpisodesService {
    private final EpisodesRepository episodesRepository;
    private final SeasonsService seasonsService;
    private final FileStorageService fileStorageService;
    private final VideoMetadataService videoMetadataService;
    private final EpisodePublicationScheduler episodePublicationScheduler;
    private final ContentStatusService statusService;
    private final EpisodeTranslationRepository episodeTranslationRepository;

    @Transactional(readOnly = true)
    public Episodes findById(Integer id){
        return episodesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Episodio no encontrado: " + id));
    }

    public Page<Episodes> findPublicBySeasonId(Integer seasonId, Pageable pageable) {
        return episodesRepository.findPublicBySeasonId(seasonId, pageable);
    }
    @Transactional(readOnly = true)
    public List<Episodes> findBySeasonIdAndReleaseDateBetween(Integer seasonId, LocalDate start, LocalDate end){
        return episodesRepository.findBySeason_SeasonIdAndReleaseDateBetween(seasonId, start, end);
    }

    @Transactional(readOnly = true)
    public List<Episodes> findBySeasonIdAndTitleContaining(Integer seasonId, String keyword){
        return episodesRepository.searchByTitle(seasonId, keyword);
    }
    @Transactional(readOnly = true)
    public Page<Episodes> findBySeasonId(Integer seasonId, Pageable pageable){
        return episodesRepository.findBySeason_SeasonId(seasonId, pageable);
    }

    @Transactional(readOnly = true)
    public Episodes findBySeasonIdAndEpisodeId(Integer seasonId, Integer episodeId){
        return episodesRepository
            .findByEpisodeIdAndSeason_SeasonId(episodeId, seasonId)
            .orElseThrow(() -> new ResourceNotFoundException(
                "Episodio no encontrado para esta temporada"
            ));
    }

    public Page<Episodes> findUpcoming(Pageable pageable) {

        return episodesRepository.findByContentStatus_CodeOrderByReleaseDateAsc(ContentStatusCode.UPCOMING.name(), pageable);
    }

    public Page<Episodes> findUpcomingBySeasonId(Integer seasonId, Pageable pageable){
        return episodesRepository.findUpcomingBySeasonId(seasonId, pageable);
    }

    @Transactional
    public void publish(Integer id) {

        Episodes episode = findById(id);

        if(ContentStatusCode.PUBLISHED.name().equals(episode.getContentStatus().getCode())){
            log.info("El episodio {} ya estaba publicado. Se omite la publicación.", id);
            return;
        }

        Seasons season = episode.getSeason();

        if(!ContentStatusCode.PUBLISHED.name().equals(season.getContentStatus().getCode())){
            throw new IllegalStateException("No se puede publicar el episodio porque la temporada no esta publicada");
        }

        Content content = season.getSeries().getContent();

        if(!ContentStatusCode.PUBLISHED.name().equals(content.getContentStatus().getCode())){
            throw new IllegalStateException("No se puede publicar el episodio porque la serie no esta publicada");
        }

        ContentStatus published = statusService.getStatus(ContentStatusCode.PUBLISHED);

        episode.setContentStatus(published);
        episodesRepository.save(episode);

        log.info("Episodio {} publicado correctamente", id);
    }

    public Episodes findPublicById(Integer id) {

        Episodes episode = episodesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Episodio no encontrado"));

        if(!ContentStatusCode.PUBLISHED.name().equals(episode.getContentStatus().getCode())){

            throw new ResourceNotFoundException("Episodio no disponible");
        }

        if(!ContentStatusCode.PUBLISHED.name().equals(episode.getSeason().getContentStatus().getCode())){
            throw new ResourceNotFoundException("Temporada no disponible");
        }

        if(!ContentStatusCode.PUBLISHED.name()
                .equals(
                    episode.getSeason()
                        .getSeries()
                        .getContent()
                        .getContentStatus()
                        .getCode()
            )
        ){
            throw new ResourceNotFoundException("Serie no disponible");
        }
        return episode;
    }

    public Episodes create(Integer seasonId, CreateEpisodeRequestDto dto){

        Seasons season = seasonsService.findById(seasonId);

        ContentStatus defaultStatus = statusService.getStatus(ContentStatusCode.DRAFT);

        boolean exists = episodesRepository
            .existsBySeason_SeasonIdAndEpisodeNumber(seasonId, dto.getEpisodeNumber());

        if(exists){
            throw new DuplicateResourceException("Ya existe episodio con ese número");
        }


        String url = fileStorageService.saveFile(dto.getEpisodeFile(), "episodes");
        System.out.println("Ruta guardada: " + url);
        String thumbnailUrl = fileStorageService.saveFile(dto.getThumbnailFile(), "episodes");

        Integer duration = videoMetadataService.getDurationMinutes(fileStorageService.getAbsolutePath(url));
        System.out.println("Duración detectada: " + duration);
        Episodes episode = new Episodes();
        episode.setEpisodeNumber(dto.getEpisodeNumber());
        episode.setDurationSeconds(duration);
        episode.setThumbnailUrl(thumbnailUrl);
        episode.setEpisodeUrl(url);
        episode.setReleaseDate(dto.getReleaseDate());
        episode.setContentStatus(defaultStatus);
        episode.setSeason(season);

        Episodes saved = episodesRepository.save(episode);

        createOriginalTranslation(
            saved,
            season.getSeries()
                .getContent()
                .getOriginalLanguage(),
            dto.getTitle(),
            dto.getDescription()
        );

        return saved;
    }
    public Episodes update(Integer seasonId, Integer episodeId, UpdateEpisodeRequestDto dto){
        Episodes episode = findBySeasonIdAndEpisodeId(seasonId, episodeId);

        if(dto.getTitle() != null ||
        dto.getDescription() != null){

            updateOriginalTranslation(
                episode,
                dto.getTitle(),
                dto.getDescription()
            );
        }
        if(dto.getEpisodeNumber() != null){
            boolean exists = episodesRepository.existsBySeason_SeasonIdAndEpisodeNumberAndEpisodeIdNot(
                episode.getSeason().getSeasonId(), dto.getEpisodeNumber(), episodeId
            );
            if(exists){
                throw new IllegalArgumentException("Ya existe otro episodio con ese número en la temporada");
            }
            episode.setEpisodeNumber(dto.getEpisodeNumber());
        }
        
        if(dto.getReleaseDate() != null){
            episode.setReleaseDate(dto.getReleaseDate());
        }


        if(dto.getStatusId() != null){
            ContentStatus status = statusService.findById(dto.getStatusId());
            episode.setContentStatus(status);
        }

        if(dto.getThumbnailFile() != null && !dto.getThumbnailFile().isEmpty()){
            String thumbnailUrl = fileStorageService.saveFile(dto.getThumbnailFile(), "episodes");
            fileStorageService.deleteFile(episode.getThumbnailUrl());
            episode.setThumbnailUrl(thumbnailUrl);
        }

        if(dto.getEpisodeFile() != null && !dto.getEpisodeFile().isEmpty()){
            String url = fileStorageService.saveFile(dto.getEpisodeFile(), "episodes");

            Integer duration = videoMetadataService.getDurationMinutes(fileStorageService.getAbsolutePath(url));

            fileStorageService.deleteFile(episode.getEpisodeUrl());
            
            episode.setEpisodeUrl(url);
            episode.setDurationSeconds(duration);
        }

        Episodes saved = episodesRepository.save(episode);

        try {
            syncPublication(saved);
        }catch (SchedulerException e){
            throw new IllegalStateException("Error al sincronizar la publicacion", e);
        }

        return saved;
    }

    @Transactional
    public Episodes updateStatus(Integer seasonId, Integer epidoseId, Integer statusId){
        Episodes episode = findBySeasonIdAndEpisodeId(seasonId, epidoseId);

        ContentStatus status = statusService.findById(statusId);

        episode.setContentStatus(status);

        Episodes saved = episodesRepository.save(episode);

        try {
            syncPublication(saved);
        }catch (Exception e){
            throw new IllegalStateException("Error al programar la publicación del episodio", e);
        }

        return saved;
    }

    public void delete(Integer seasonID,Integer episodeId){

        Episodes episode = findBySeasonIdAndEpisodeId(seasonID, episodeId);

        fileStorageService.deleteFile(episode.getEpisodeUrl());
        fileStorageService.deleteFile(episode.getThumbnailUrl());

        try {
            episodePublicationScheduler.cancel(episode.getEpisodeId());
        }catch (SchedulerException e){
            log.error("Error al cancelar la publicación del episodio ", e);
        }

        episodesRepository.delete(episode);
    }


    private void syncPublication(Episodes episode) throws SchedulerException {

        
        if(ContentStatusCode.UPCOMING.name().equalsIgnoreCase(episode.getContentStatus().getCode())){

            if(episode.getReleaseDate() == null) {
                throw new IllegalArgumentException("El episode UPCOMING necesita fecha de estreno");
            }

            if(episode.getReleaseDate().isBefore(Instant.now())){
                throw new IllegalArgumentException("La fecha de estreno debe ser futura");
            }

            episodePublicationScheduler.schedule(
                episode.getEpisodeId(),
                episode.getReleaseDate()
            );
        }else {
            
            episodePublicationScheduler.cancel(episode.getEpisodeId());
        }
    }

    private void createOriginalTranslation(
            Episodes episode,
            Language language,
            String title,
            String description
    ){
        EpisodeTranslation translation =
            new EpisodeTranslation();

        translation.setEpisode(episode);
        translation.setLanguage(language);
        translation.setTitle(title);
        translation.setDescription(description);

        episodeTranslationRepository.save(translation);
    }

    private void updateOriginalTranslation(
            Episodes episode,
            String title,
            String description
    ){

        Language originalLanguage =
            episode.getSeason()
                .getSeries()
                .getContent()
                .getOriginalLanguage();

        EpisodeTranslation translation =
            episodeTranslationRepository
                .findByEpisode_EpisodeIdAndLanguage_LanguageId(
                    episode.getEpisodeId(),
                    originalLanguage.getLanguageId()
                )
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Traducción original no encontrada para el episodio: "
                        + episode.getEpisodeId()
                    )
                );

        if(title != null){
            translation.setTitle(title);
        }

        if(description != null){
            translation.setDescription(description);
        }

        episodeTranslationRepository.save(translation);
    }

}

