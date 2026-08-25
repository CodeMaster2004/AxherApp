package com.axher.backend.support.tickets.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.language.entities.Language;
import com.axher.backend.support.tickets.entities.SupportCategory;
import com.axher.backend.support.tickets.entities.SupportCategoryTranslation;

public interface SupportCategoryTranslationRepository
        extends JpaRepository<SupportCategoryTranslation, Integer> {

    Optional<SupportCategoryTranslation>
    findBySupportCategory_SupportCategoryIdAndLanguage_Code(
        Integer categoryId,
        String languageCode
    );

    List<SupportCategoryTranslation>
    findBySupportCategory_SupportCategoryId(
        Integer categoryId
    );

    boolean existsBySupportCategory_SupportCategoryIdAndLanguage_LanguageId(
        Integer categoryId,
        Integer languageId
    );

    Optional<SupportCategoryTranslation>
    findBySupportCategory_SupportCategoryIdAndLanguage_LanguageId(
        Integer categoryId,
        Integer languageId
    );

    void deleteBySupportCategory_SupportCategoryId(
        Integer categoryId
    );

    Optional<SupportCategoryTranslation>
    findBySupportCategoryAndLanguage(
        SupportCategory category,
        Language language
    );

    Optional<SupportCategoryTranslation>
    findFirstBySupportCategory_SupportCategoryId(
        Integer categoryId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndSupportCategory_SupportCategoryIdNot(
        String name,
        Integer languageId,
        Integer supportCategoryId
    );
}