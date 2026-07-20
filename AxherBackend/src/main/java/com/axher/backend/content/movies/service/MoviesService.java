package com.axher.backend.content.movies.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;
import com.axher.backend.content.core.strategy.ContentTypeService;
import com.axher.backend.content.media.service.VideoMetadataService;
import com.axher.backend.content.movies.DTOs.CreateMovieDto;
import com.axher.backend.content.movies.DTOs.UpdateMovieDto;
import com.axher.backend.content.movies.entities.Movies;
import com.axher.backend.content.movies.repositories.MoviesRepository;
import com.axher.backend.infrastructure.storage.FileStorageService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class MoviesService implements ContentTypeService{

    private final MoviesRepository moviesRepository;
    private final FileStorageService fileStorageService;
    private final VideoMetadataService videoMetadataService;
    
    @Override
    public ContentTypeEnum getType() {
        return ContentTypeEnum.MOVIE;
    }
    
    @Override
    public void create(Content content, Object dtoObj) {

        Movies movie = new Movies();

        if (!(dtoObj instanceof CreateMovieDto dto)) {
            throw new IllegalArgumentException("DTO inválido para tipo MOVIE");
        }

        String movieFile = fileStorageService.saveFile(dto.getMovieFile(), "movies");

        Integer duration = videoMetadataService.getDurationMinutes(fileStorageService.getAbsolutePath(movieFile));
        movie.setContent(content);
        movie.setDurationSeconds(duration);
        // Guardar el archivo de la película
        movie.setMovieUrl(movieFile);

        moviesRepository.save(movie);
    }

    @Override
    public void update(Content content, Object dtoObj) {

        if (!(dtoObj instanceof UpdateMovieDto dto)) {
            throw new IllegalArgumentException("DTO inválido para tipo MOVIE");
        }
        Movies movie = content.getMovie();
        
        if(movie == null){
            throw new IllegalStateException("El contenido no tiene película asociada");
        }

        if (dto.getMovieFile() != null && !dto.getMovieFile().isEmpty()) {
            
            String newMovieFile = fileStorageService.saveFile(dto.getMovieFile(), "movies");

            Integer duration = videoMetadataService.getDurationMinutes(fileStorageService.getAbsolutePath(newMovieFile));

            fileStorageService.deleteFile(movie.getMovieUrl());

            movie.setMovieUrl(newMovieFile);
            movie.setDurationSeconds(duration);
        }

        moviesRepository.save(movie);
    }

    @Override
    public void delete(Content content){

        Movies movie = content.getMovie();
        if(movie == null){
            return;
        }

        String movieFile = movie.getMovieUrl();
        moviesRepository.delete(movie); // Eliminar la entidad Movie
        fileStorageService.deleteFile(movieFile); // Eliminar el archivo de la película
    
        
    }
    


}

