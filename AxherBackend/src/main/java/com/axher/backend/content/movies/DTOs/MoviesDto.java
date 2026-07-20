package com.axher.backend.content.movies.DTOs;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class MoviesDto {

   private Integer durationSeconds;
    private MultipartFile movieFile;
    
}
