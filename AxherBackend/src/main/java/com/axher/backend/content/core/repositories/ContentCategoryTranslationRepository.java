package com.axher.backend.content.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.ContentCategories;
import com.axher.backend.content.core.entities.ContentCategoryTranslation;
import com.axher.backend.language.entities.Language;

public interface ContentCategoryTranslationRepository
        extends JpaRepository<ContentCategoryTranslation, Integer> {

    Optional<ContentCategoryTranslation>
    findByContentCategory_ContentCategoryIdAndLanguage_Code(
            Integer categoryId,
            String languageCode
    );

    List<ContentCategoryTranslation>
    findByContentCategory_ContentCategoryId(
            Integer categoryId
    );

    boolean existsByContentCategory_ContentCategoryIdAndLanguage_LanguageId(
            Integer categoryId,
            Integer languageId
    );

    Optional<ContentCategoryTranslation>
    findByContentCategory_ContentCategoryIdAndLanguage_LanguageId(
            Integer categoryId,
            Integer languageId
    );

    void deleteByContentCategory_ContentCategoryId(
            Integer categoryId
    );

    Optional<ContentCategoryTranslation>
    findByContentCategoryAndLanguage(
            ContentCategories contentCategory,
            Language language
    );

    Optional<ContentCategoryTranslation>
    findFirstByContentCategory_ContentCategoryId(
            Integer categoryId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
            String name,
            Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndContentCategory_ContentCategoryIdNot(
            String name,
            Integer languageId,
            Integer categoryId
    );
}