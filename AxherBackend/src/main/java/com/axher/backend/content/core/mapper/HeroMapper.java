package com.axher.backend.content.core.mapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.HeroContentDto;

@Component
public class HeroMapper {

    @Value("${app.base-url}")
    private String baseUrl;


    public HeroContentDto map(HeroContentDto dto){

        dto.setBackdropUrl(buildUrl(dto.getBackdropUrl()));
        dto.setTrailerUrl(buildUrl(dto.getTrailerUrl()));

        return dto;
    }


    private String buildUrl(String path){

        if(path == null){
            return null;
        }

        return baseUrl + path;
    }
}
