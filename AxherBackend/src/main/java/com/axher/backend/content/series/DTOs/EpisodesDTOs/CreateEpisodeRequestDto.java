package com.axher.backend.content.series.DTOs.EpisodesDTOs;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class CreateEpisodeRequestDto {
    private Integer episodeNumber;
    private String title;
    private String description;
    private MultipartFile thumbnailFile;
    private MultipartFile episodeFile;
    private LocalDateTime releaseDate;
    private Integer statusId;
}
