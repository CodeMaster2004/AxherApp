package com.axher.backend.content.playback.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.repositories.ContentRepository;
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
}
