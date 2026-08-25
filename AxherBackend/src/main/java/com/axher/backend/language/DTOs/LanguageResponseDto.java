package com.axher.backend.language.DTOs;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LanguageResponseDto {
    
    private Integer languageId;
    private String code;
    private String name;
    private String nativeName;
    private Boolean active;
}
