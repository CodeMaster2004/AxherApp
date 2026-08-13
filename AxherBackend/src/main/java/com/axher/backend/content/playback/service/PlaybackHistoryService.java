package com.axher.backend.content.playback.service;

import com.axher.backend.content.playback.mapper.ContinueWatchingMapper;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
import com.axher.backend.content.playback.DTOs.ContinueWatchingDto;
import com.axher.backend.content.playback.DTOs.PlaybackHistoryRequestDto;
import com.axher.backend.content.playback.entities.PlaybackHistory;
import com.axher.backend.content.playback.repositories.PlaybackHistoryRepository;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.repositories.EpisodesRepository;
import com.axher.backend.users.entities.Users;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlaybackHistoryService {
    
    private final ContinueWatchingMapper continueWatchingMapper;
    private final PlaybackHistoryRepository playbackHistoryRepository;
    private final ContentRepository contentRepository;
    private final EpisodesRepository episodeRepository;


    public PlaybackHistory saveOrUpdate(PlaybackHistoryRequestDto dto){

        Users user = getCurrentUser();

        Content content = contentRepository.findById(dto.getContentId())
            .orElseThrow(() -> new EntityNotFoundException("Contenido no encontrado"));

        PlaybackHistory history;

        if(dto.getEpisodeId() == null){

            history = playbackHistoryRepository
                    .findByUser_UserIdAndContent_ContentIdAndEpisodeIsNull(
                        user.getUserId(),
                        dto.getContentId())
                    .orElse(new PlaybackHistory());
        }else{

            Episodes episode = episodeRepository.findById(dto.getEpisodeId())
                    .orElseThrow(() -> new EntityNotFoundException("Episodio no encontrado"));

            history = playbackHistoryRepository
                    .findByUser_UserIdAndEpisode_EpisodeId(
                        user.getUserId(),
                        dto.getEpisodeId())
                    .orElse(new PlaybackHistory());
                
            history.setEpisode(episode);
        }

        history.setUser(user);
        history.setContent(content);
        history.setWatchedSeconds(dto.getWatchedSeconds());
        history.setWatchedAt(LocalDateTime.now());

        return playbackHistoryRepository.save(history);
    }

    public List<PlaybackHistory> getHistory(){
        Users user = getCurrentUser();
        return playbackHistoryRepository.findTop20ByUser_UserIdOrderByWatchedAtDesc(user.getUserId());
    }

    public PlaybackHistory getProgress(
        Integer ContentId,
        Integer episodeId
    ){
        Users user = getCurrentUser();

        if(episodeId == null){
            
            return playbackHistoryRepository
                    .findByUser_UserIdAndContent_ContentIdAndEpisodeIsNull(
                        user.getUserId(),
                        ContentId)
                    .orElse(null);
        }

        return playbackHistoryRepository
                .findByUser_UserIdAndEpisode_EpisodeId(
                    user.getUserId(),
                    episodeId)
                .orElse(null);
    }

    private Users getCurrentUser(){
        return (Users) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public List<ContinueWatchingDto> getContinueWatching(){

        Users user = getCurrentUser();
        Pageable pageable = PageRequest.of(0, 50);

        return playbackHistoryRepository
                .findContinueWatching(user.getUserId(), pageable)
                .stream()
                .map(continueWatchingMapper::toContinueWatching)


                // quitar terminados
                .filter(dto ->
                    dto.getProgress() != null &&
                    dto.getProgress() < 95
                )
                // dejar solo uno por contenido
                .collect(Collectors.toMap(

                    ContinueWatchingDto::getContentId,

                    dto -> dto,

                    // conserva el primero
                    // porque viene ordenado por watchedAt DESC
                    (first, second) -> first,

                    LinkedHashMap::new

                ))
                .values()
                .stream()
                .limit(10)
                .toList();
    }

    
}
