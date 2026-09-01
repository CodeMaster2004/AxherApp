package com.axher.backend.support.SupportFaq.mapper;

import org.springframework.stereotype.Component;

import com.axher.backend.support.SupportFaq.DTOs.SupportFaqResponseDto;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;
import com.axher.backend.support.SupportFaq.service.SupportFaqLocalizationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SupportFaqMapper {

    private final SupportFaqLocalizationService localizationService;
    
    public SupportFaqResponseDto toDto(SupportFaq faq) {

        SupportFaqResponseDto dto = new SupportFaqResponseDto();
        
        dto.setSupportFaqId(faq.getSupportFaqId());
        dto.setSupportCategoryId(faq.getSupportCategory().getSupportCategoryId());
        dto.setDisplayOrder(faq.getDisplayOrder());
        dto.setActive(faq.getActive());
        var localized = localizationService.resolve(faq);
        dto.setQuestion(localized.question());
        dto.setAnswer(localized.answer());
        dto.setLanguageId(localized.languageId());
        return dto;
    }
}
