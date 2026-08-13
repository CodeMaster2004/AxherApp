package com.axher.backend.content.media.service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpRange;
import org.springframework.stereotype.Service;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.service.ContentCatalogService;
import com.axher.backend.content.series.entities.Episodes;
import com.axher.backend.content.series.service.EpisodesService;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final ContentCatalogService catalogService;
    private final EpisodesService episodeService;

    @Value("${app.upload-dir}")
    private String uploadDir;

    public ResourceRegion getMovie(Integer contentId, String rangeHeader) throws IOException {

        Content content = catalogService.findPublicById(contentId);

        if(content.getMovie() == null ) {
            throw new ResourceNotFoundException("El contenido no tiene pelicula");
        }

       return buildRegion(content.getMovie().getMovieUrl(), parseRange(rangeHeader));
    }

    public ResourceRegion getEpisode(Integer episodeId, String rangeHeader) throws IOException {

        Episodes episode = episodeService.findPublicById(episodeId);

        return buildRegion(episode.getEpisodeUrl(), parseRange(rangeHeader));
    }

    private HttpRange parseRange(String rangeHeader) {
        if(rangeHeader == null || rangeHeader.isBlank()){
            return null;
        }
        return HttpRange.parseRanges(rangeHeader).getFirst();
    }

    private ResourceRegion buildRegion(String file, HttpRange range) throws IOException {

        Path path = Paths
            .get(uploadDir)
            .resolve(file)
            .normalize();

        if (!path.toFile().exists()) {
            throw new ResourceNotFoundException("Archivo no encontrado");
        }
        FileSystemResource resource = new FileSystemResource(path);

        long chunkSize = 1024 * 1024; // 1MB
        long contentLength = resource.contentLength();

        if(range == null){
            return new ResourceRegion(
                resource,
                0,
                Math.min(chunkSize, contentLength)
            );
        }

        long start = range.getRangeStart(contentLength);
        long end = range.getRangeEnd(contentLength);
        long length = Math.min(chunkSize, end - start + 1);
        return new ResourceRegion(resource, start, length);

    }
    
}
