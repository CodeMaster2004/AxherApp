package com.axher.backend.catalog.banner.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.banner.entities.HeroBanner;
import com.axher.backend.catalog.banner.entities.HeroBannerTranslation;
import com.axher.backend.language.entities.Language;

public interface HeroBannerTranslationRepository
        extends JpaRepository<HeroBannerTranslation, Integer> {

    Optional<HeroBannerTranslation>
    findByHeroBanner_HeroBannerIdAndLanguage_Code(
        Integer heroBannerId,
        String languageCode
    );

    List<HeroBannerTranslation>
    findByHeroBanner_HeroBannerId(
        Integer heroBannerId
    );

    boolean existsByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
        Integer heroBannerId,
        Integer languageId
    );

    Optional<HeroBannerTranslation>
    findByHeroBanner_HeroBannerIdAndLanguage_LanguageId(
        Integer heroBannerId,
        Integer languageId
    );

    void deleteByHeroBanner_HeroBannerId(
        Integer heroBannerId
    );

    Optional<HeroBannerTranslation>
    findByHeroBannerAndLanguage(
        HeroBanner heroBanner,
        Language language
    );

    Optional<HeroBannerTranslation>
    findFirstByHeroBanner_HeroBannerId(
        Integer heroBannerId
    );
}
