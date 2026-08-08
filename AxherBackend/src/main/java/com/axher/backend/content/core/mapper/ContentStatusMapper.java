package com.axher.backend.content.core.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.content.core.DTOs.ContentStatusResponseDto;
import com.axher.backend.content.core.entities.ContentStatus;

@Component
public class ContentStatusMapper {
    
    public ContentStatusResponseDto toDto(ContentStatus status){

        if(status == null){
            return null;
        }

        ContentStatusResponseDto dto = new ContentStatusResponseDto();

        dto.setContentStatusId(status.getContentStatusId());
        dto.setCode(status.getCode());
        dto.setName(status.getName());

        return dto;
    }
}
