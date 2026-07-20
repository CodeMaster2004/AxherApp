package com.axher.backend.content.media.controller;

import java.io.IOException;

import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.content.media.service.MediaService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @GetMapping("/videos/{contentId}/stream")
    public ResponseEntity<ResourceRegion> streamVideo(@PathVariable Integer contentId,
        @RequestHeader (value = "Range", required = false) String range
    ) throws IOException{

        ResourceRegion region = mediaService.getMovie(contentId, range);

        return ResponseEntity
            .status(range == null 
            ? HttpStatus.OK
            : HttpStatus.PARTIAL_CONTENT)
            .contentType(MediaType.valueOf("video/mp4"))
            .body(region);
    }

    @GetMapping("/episodes/{episodeId}/stream")
    public ResponseEntity<ResourceRegion> streamEpisode(@PathVariable Integer episodeId,
        @RequestHeader(value = "Range", required = false) String range
    ) throws IOException {

       ResourceRegion region = mediaService.getEpisode(episodeId, range);

       return ResponseEntity
            .status(range == null 
            ? HttpStatus.OK
            : HttpStatus.PARTIAL_CONTENT)
            .contentType(MediaType.valueOf("video/mp4"))
            .body(region);

       
    }

    
}

