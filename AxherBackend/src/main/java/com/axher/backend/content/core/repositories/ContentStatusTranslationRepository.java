package com.axher.backend.content.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.ContentStatus;
import com.axher.backend.content.core.entities.ContentStatusTranslation;
import com.axher.backend.language.entities.Language;

public interface ContentStatusTranslationRepository
        extends JpaRepository<ContentStatusTranslation, Integer> {

    Optional<ContentStatusTranslation>
    findByContentStatus_ContentStatusIdAndLanguage_Code(
        Integer statusId,
        String languageCode
    );

    List<ContentStatusTranslation>
    findByContentStatus_ContentStatusId(
        Integer statusId
    );

    boolean existsByContentStatus_ContentStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    Optional<ContentStatusTranslation>
    findByContentStatus_ContentStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    void deleteByContentStatus_ContentStatusId(
        Integer statusId
    );

    Optional<ContentStatusTranslation>
    findByContentStatusAndLanguage(
        ContentStatus status,
        Language language
    );

    Optional<ContentStatusTranslation>
    findFirstByContentStatus_ContentStatusId(
        Integer statusId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndContentStatus_ContentStatusIdNot(
            String name,
            Integer languageId,
            Integer contentStatusId
    );
}
