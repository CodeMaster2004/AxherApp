package com.axher.backend.support.tickets.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.tickets.DTOs.SupportCategoryResponseDto;
import com.axher.backend.support.tickets.entities.SupportCategory;

@Component
public class SupportCategoryMapper {

    public SupportCategoryResponseDto toDto(SupportCategory status) {
        SupportCategoryResponseDto dto = new SupportCategoryResponseDto();
        dto.setSupportCategoryId(status.getSupportCategoryId());
        dto.setCode(status.getCode());
        dto.setName(status.getName());
        dto.setDescription(status.getDescription());
        return dto;
    }
    
}
