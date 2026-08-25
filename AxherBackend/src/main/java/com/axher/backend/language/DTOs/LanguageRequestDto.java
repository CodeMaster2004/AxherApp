package com.axher.backend.language.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LanguageRequestDto {
    private String code;
    private String name;
    private String nativeName;
    private Boolean active;
}
