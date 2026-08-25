package com.axher.backend.content.core.DTOs;

import lombok.Data;

@Data
public class ContentStatusResponseDto {
    
    private Integer contentStatusId;
    private String code;
    private String name;
    private String description;
    private Integer languageId;
}
