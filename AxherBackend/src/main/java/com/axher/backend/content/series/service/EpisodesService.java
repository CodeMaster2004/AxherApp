package com.axher.backend.content.series.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.content.media.service.VideoMetadataService;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.CreateEpisodeRequestDto;
import com.axher.backend.content.series.DTOs.EpisodesDTOs.UpdateEpisodeRequestDto;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.entities.Seasons;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EpisodesService {
    private final EpisodesRepository episodesRepository;
    private final SeasonsService seasonsService;
    private final FileStorageService fileStorageService;
    private final VideoMetadataService videoMetadataService;

    @Transactional(readOnly = true)
    public Episodes findById(Integer id){
        return episodesRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Episodio no encontrado: " + id));
    }
    @Transactional(readOnly = true)
    public List<Episodes> findBySeasonIdAndReleaseDateBetween(Integer seasonId, LocalDate start, LocalDate end){
        return episodesRepository.findBySeason_SeasonIdAndReleaseDateBetween(seasonId, start, end);
    }

    @Transactional(readOnly = true)
    public List<Episodes> findBySeasonIdAndTitleContaining(Integer seasonId, String keyword){
        return episodesRepository.findBySeason_SeasonIdAndTitleContainingIgnoreCase(seasonId, keyword);
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

    public Episodes create(Integer seasonId, CreateEpisodeRequestDto dto){

        Seasons season = seasonsService.findById(seasonId);

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
        episode.setTitle(dto.getTitle());
        episode.setDescription(dto.getDescription());
        episode.setDurationSeconds(duration);
        episode.setThumbnailUrl(thumbnailUrl);
        episode.setEpisodeUrl(url);
        episode.setReleaseDate(dto.getReleaseDate());
        episode.setSeason(season);

        return episodesRepository.save(episode);
    }
    public Episodes update(Integer seasonId, Integer episodeId, UpdateEpisodeRequestDto dto){
        Episodes episode = findBySeasonIdAndEpisodeId(seasonId, episodeId);

        if(dto.getTitle() != null){
            episode.setTitle(dto.getTitle());
        }
        if(dto.getDescription() != null){
            episode.setDescription(dto.getDescription());
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

        return episodesRepository.save(episode);
    }

    public void delete(Integer seasonID,Integer episodeId){

        Episodes episode = findBySeasonIdAndEpisodeId(seasonID, episodeId);

        fileStorageService.deleteFile(episode.getEpisodeUrl());
        fileStorageService.deleteFile(episode.getThumbnailUrl());

        episodesRepository.delete(episode);
    }

}

