package com.axher.backend.content.people.service;

import org.springframework.stereotype.Service;

import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CinematicRoleLocalizationService {

    private final CinematicRoleTranslationService translationService;

    private final CurrentLanguageService currentLanguageService;


    public LocalizedCinematicRole resolve(
            CinematicRole role
    ) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(role);
        }

        return translationService
                .findByRoleAndLanguage(
                        role.getCinematicRoleId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedCinematicRole(
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage()
                                        .getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(role)
                );
    }


    private LocalizedCinematicRole resolveFallback(
            CinematicRole role
    ) {

        return translationService
                .findFirstAvailable(
                        role.getCinematicRoleId()
                )
                .map(translation ->
                        new LocalizedCinematicRole(
                                translation.getName(),
                                translation.getDescription(),
                                translation.getLanguage()
                                        .getLanguageId()
                        )
                )
                .orElseThrow(() ->
                        new IllegalStateException(
                                "El rol cinematográfico "
                                        + role.getCinematicRoleId()
                                        + " no tiene traducciones"
                        )
                );
    }


    public record LocalizedCinematicRole(
            String name,
            String description,
            Integer languageId
    ) {}
}