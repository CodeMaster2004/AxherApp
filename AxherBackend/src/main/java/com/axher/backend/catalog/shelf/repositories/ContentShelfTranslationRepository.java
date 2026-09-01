package com.axher.backend.catalog.shelf.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.catalog.shelf.entities.ContentShelfTranslation;

public interface ContentShelfTranslationRepository
        extends JpaRepository<ContentShelfTranslation, Integer> {

    Optional<ContentShelfTranslation>
    findByContentShelf_ContentShelfIdAndLanguage_Code(
            Integer shelfId,
            String languageCode
    );

    Optional<ContentShelfTranslation>
    findFirstByContentShelf_ContentShelfId(
            Integer shelfId
    );

    List<ContentShelfTranslation>
    findByContentShelf_ContentShelfId(
            Integer shelfId
    );

    Optional<ContentShelfTranslation>
    findByContentShelf_ContentShelfIdAndLanguage_LanguageId(
            Integer shelfId,
            Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
            String name,
            Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndContentShelf_ContentShelfIdNot(
            String name,
            Integer languageId,
            Integer shelfId
    );

    boolean existsByContentShelf_ContentShelfIdAndLanguage_LanguageId(
            Integer shelfId,
            Integer languageId
    );

    
}