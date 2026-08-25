package com.axher.backend.language.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.language.DTOs.LanguageResponseDto;
import com.axher.backend.language.entities.Language;

@Component
public class LanguageMapper {

    public LanguageResponseDto toDto(Language language) {

        if (language == null) {
            return null;
        }

        return LanguageResponseDto.builder()
                .languageId(language.getLanguageId())
                .code(language.getCode())
                .name(language.getName())
                .nativeName(language.getNativeName())
                .active(language.getActive())
                .build();
    }
}