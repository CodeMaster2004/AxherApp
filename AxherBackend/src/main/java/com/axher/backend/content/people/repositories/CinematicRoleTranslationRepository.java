package com.axher.backend.content.people.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.people.entities.CinematicRole;
import com.axher.backend.content.people.entities.CinematicRoleTranslation;
import com.axher.backend.language.entities.Language;

public interface CinematicRoleTranslationRepository
        extends JpaRepository<CinematicRoleTranslation, Integer> {

    Optional<CinematicRoleTranslation>
    findByCinematicRole_CinematicRoleIdAndLanguage_Code(
            Integer cinematicRoleId,
            String languageCode
    );

    List<CinematicRoleTranslation>
    findByCinematicRole_CinematicRoleId(
            Integer cinematicRoleId
    );

    boolean existsByCinematicRole_CinematicRoleIdAndLanguage_LanguageId(
            Integer cinematicRoleId,
            Integer languageId
    );

    Optional<CinematicRoleTranslation>
    findByCinematicRole_CinematicRoleIdAndLanguage_LanguageId(
            Integer cinematicRoleId,
            Integer languageId
    );

    void deleteByCinematicRole_CinematicRoleId(
            Integer cinematicRoleId
    );

    Optional<CinematicRoleTranslation>
    findByCinematicRoleAndLanguage(
            CinematicRole cinematicRole,
            Language language
    );

    Optional<CinematicRoleTranslation>
    findFirstByCinematicRole_CinematicRoleId(
            Integer cinematicRoleId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
            String name,
            Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndCinematicRole_CinematicRoleIdNot(
            String name,
            Integer languageId,
            Integer cinematicRoleId
    );
}
