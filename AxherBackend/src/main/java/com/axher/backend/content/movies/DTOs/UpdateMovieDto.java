package com.axher.backend.content.movies.DTOs;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class UpdateMovieDto {
    private MultipartFile movieFile;
}

