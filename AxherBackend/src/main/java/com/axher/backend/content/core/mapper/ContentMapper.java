package com.axher.backend.content.core.mapper;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentDetailDto;
import com.axher.backend.content.core.DTOs.ContentStatusResponseDto;
import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTypeEnum;

@Component
public class ContentMapper {
    @Value("${app.base-url}")
    private String baseUrl;

    public ContentDetailDto toDto(Content content) {
        
        ContentDetailDto dto = new ContentDetailDto();

        dto.setContentId(content.getContentId());
        dto.setTitle(content.getTitle());
        dto.setDescription(content.getDescription());
        dto.setPrice(content.getPrice());

        dto.setType(content.getType());

        dto.setPosterUrl(buildUrl(content.getPosterUrl()));
        dto.setBackdropUrl(buildUrl(content.getBackdropUrl()));
        dto.setTrailerUrl(buildUrl(content.getTrailerUrl()));
        
        dto.setCategories(
            content.getCategories()
                 .stream()
                 .map(c -> c.getName())
                 .collect(Collectors.toList())
        );

        // Status plano
        dto.setStatus(toStatusDto(content));

        // Solo monto de descuento
        dto.setDiscountAmount(
            content.getDiscount() != null
                ? content.getDiscount().getAmount()
                : null
        );
        dto.setRegisteredAt(content.getRegisteredAt());
        dto.setReleaseDate(content.getReleaseDate());
        
         // Solo si es Movie
        if (ContentTypeEnum.MOVIE.equals(content.getType()) && content.getMovie() != null) {
            dto.setDurationSeconds(content.getMovie().getDurationSeconds());
            //dto.setMovieUrl(buildUrl(content.getMovie().getMovieUrl()));
        }
        
        return dto;
    }

    // DTO completo para edición
    private ContentStatusResponseDto toStatusDto(Content content){

        if(content.getContentStatus() == null){
            return null;
        }

        ContentStatusResponseDto dto = new ContentStatusResponseDto();

        dto.setContentStatusId(
            content.getContentStatus().getContentStatusId()
        );

        dto.setCode(
            content.getContentStatus().getCode()
        );

        return dto;
    }



    public String buildUrl(String path){
        if(path == null) return null;
        return baseUrl + path;
    }
}
