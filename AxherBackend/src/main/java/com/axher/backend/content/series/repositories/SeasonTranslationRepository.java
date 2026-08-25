package com.axher.backend.content.series.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.series.entities.SeasonTranslation;

public interface SeasonTranslationRepository extends JpaRepository<SeasonTranslation, Integer> {

    Optional<SeasonTranslation>
    findBySeason_SeasonIdAndLanguage_Code(
        Integer seasonId,
        String languageCode
    );

    List<SeasonTranslation>
    findBySeason_SeasonId(
        Integer seasonId
    );

    boolean existsBySeason_SeasonIdAndLanguage_LanguageId(
        Integer seasonId,
        Integer languageId
    );

    Optional<SeasonTranslation>
    findBySeason_SeasonIdAndLanguage_LanguageId(
        Integer seasonId,
        Integer languageId
    );

    void deleteBySeason_SeasonId(
        Integer seasonId
    );

}
