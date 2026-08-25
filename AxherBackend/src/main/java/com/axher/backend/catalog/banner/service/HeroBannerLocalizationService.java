package com.axher.backend.catalog.banner.service;

import org.springframework.stereotype.Service;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.language.service.CurrentLanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeroBannerLocalizationService {

    private final HeroBannerTranslationService translationService;
    private final CurrentLanguageService currentLanguageService;

    public LocalizedBanner resolve(HeroBanner banner) {

        String languageCode =
                currentLanguageService.getCurrentLanguage();

        if (languageCode == null || languageCode.isBlank()) {
            return resolveFallback(banner);
        }

        return translationService
                .findByBannerAndLanguage(
                        banner.getHeroBannerId(),
                        languageCode
                )
                .map(translation ->
                        new LocalizedBanner(
                                banner.getHeroBannerId(),
                                translation.getTitleOverride(),
                                translation.getDescriptionOverride(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        resolveFallback(banner)
                );
    }

    private LocalizedBanner resolveFallback(
            HeroBanner banner
    ) {

        return translationService
                .findFirstAvailable(
                        banner.getHeroBannerId()
                )
                .map(translation ->
                        new LocalizedBanner(
                                banner.getHeroBannerId(),
                                translation.getTitleOverride(),
                                translation.getDescriptionOverride(),
                                translation.getLanguage().getLanguageId()
                        )
                )
                .orElseGet(() ->
                        new LocalizedBanner(
                                banner.getHeroBannerId(),
                                null,
                                null,
                                null
                        )
                );
    }

    public record LocalizedBanner(
            Integer heroBannerId,
            String titleOverride,
            String descriptionOverride,
            Integer languageId
    ) {}
}
