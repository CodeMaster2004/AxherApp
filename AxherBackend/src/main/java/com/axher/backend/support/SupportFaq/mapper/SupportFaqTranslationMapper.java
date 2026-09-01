package com.axher.backend.support.SupportFaq.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.SupportFaq.DTOs.SupportFaqTranslationDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaqTranslation;

@Component
public class SupportFaqTranslationMapper {

    public SupportFaqTranslationDto toDto(SupportFaqTranslation translation) {
        SupportFaqTranslationDto dto = new SupportFaqTranslationDto();
        
        dto.setSupportFaqId(translation.getSupportFaq().getSupportFaqId());
        dto.setLanguageId(translation.getLanguage().getLanguageId());
        dto.setLanguageCode(translation.getLanguage().getCode());
        dto.setLanguageName(translation.getLanguage().getName());
        dto.setQuestion(translation.getQuestion());
        dto.setAnswer(translation.getAnswer());
        return dto;
    }
    
}
