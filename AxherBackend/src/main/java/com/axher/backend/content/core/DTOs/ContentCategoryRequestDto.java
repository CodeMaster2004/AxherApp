package com.axher.backend.content.core.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentCategoryRequestDto {
    private String name;
    private String description;
    private Integer languageId;
}
