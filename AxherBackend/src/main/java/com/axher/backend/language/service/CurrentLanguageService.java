package com.axher.backend.language.service;

import java.util.Locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

import com.axher.backend.language.entities.Language;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentLanguageService {

    private final LanguageService languageService;

    public String getCurrentLanguage() {

        Locale locale = LocaleContextHolder.getLocale();

        String languageCode = locale.getLanguage();

        return languageService
                .findActiveByCode(languageCode)
                .map(Language::getCode)
                .orElse("es");
    }
}
