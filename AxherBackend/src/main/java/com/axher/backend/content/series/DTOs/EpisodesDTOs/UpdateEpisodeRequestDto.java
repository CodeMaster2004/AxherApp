package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class UpdateEpisodeRequestDto {
    private Integer episodeId;
    private Integer episodeNumber;
    private String title;
    private String description;
    private MultipartFile thumbnailFile;
    private MultipartFile episodeFile; 
    private LocalDate releaseDate;
}
