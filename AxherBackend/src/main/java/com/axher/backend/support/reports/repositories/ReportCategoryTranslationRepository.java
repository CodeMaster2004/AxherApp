package com.axher.backend.support.reports.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.language.entities.Language;
import com.axher.backend.support.reports.entities.ReportCategory;
import com.axher.backend.support.reports.entities.ReportCategoryTranslation;

public interface ReportCategoryTranslationRepository
        extends JpaRepository<ReportCategoryTranslation, Integer> {

    Optional<ReportCategoryTranslation>
    findByReportCategory_ReportCategoryIdAndLanguage_Code(
            Integer categoryId,
            String languageCode
    );

    List<ReportCategoryTranslation>
    findByReportCategory_ReportCategoryId(
            Integer categoryId
    );

    boolean existsByReportCategory_ReportCategoryIdAndLanguage_LanguageId(
            Integer categoryId,
            Integer languageId
    );

    Optional<ReportCategoryTranslation>
    findByReportCategory_ReportCategoryIdAndLanguage_LanguageId(
            Integer categoryId,
            Integer languageId
    );

    void deleteByReportCategory_ReportCategoryId(
            Integer categoryId
    );

    Optional<ReportCategoryTranslation>
    findByReportCategoryAndLanguage(
            ReportCategory category,
            Language language
    );

    Optional<ReportCategoryTranslation>
    findFirstByReportCategory_ReportCategoryId(
            Integer categoryId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
            String name,
            Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndReportCategory_ReportCategoryIdNot(
            String name,
            Integer languageId,
            Integer reportCategoryId
    );
}