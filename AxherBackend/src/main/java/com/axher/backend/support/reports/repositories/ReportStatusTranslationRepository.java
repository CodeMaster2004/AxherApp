package com.axher.backend.support.reports.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.language.entities.Language;
import com.axher.backend.support.reports.entities.ReportStatus;
import com.axher.backend.support.reports.entities.ReportStatusTranslation;

public interface ReportStatusTranslationRepository
        extends JpaRepository<ReportStatusTranslation, Integer> {

    Optional<ReportStatusTranslation>
    findByReportStatus_ReportStatusIdAndLanguage_Code(
        Integer statusId,
        String languageCode
    );

    List<ReportStatusTranslation>
    findByReportStatus_ReportStatusId(
        Integer statusId
    );

    boolean existsByReportStatus_ReportStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    Optional<ReportStatusTranslation>
    findByReportStatus_ReportStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    void deleteByReportStatus_ReportStatusId(
        Integer statusId
    );

    Optional<ReportStatusTranslation>
    findByReportStatusAndLanguage(
        ReportStatus status,
        Language language
    );

    Optional<ReportStatusTranslation>
    findFirstByReportStatus_ReportStatusId(
        Integer statusId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndReportStatus_ReportStatusIdNot(
        String name,
        Integer languageId,
        Integer reportStatusId
    );

}
