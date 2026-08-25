package com.axher.backend.support.tickets.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.language.entities.Language;
import com.axher.backend.support.tickets.entities.SupportTicketStatus;
import com.axher.backend.support.tickets.entities.SupportTicketStatusTranslation;

public interface SupportTicketStatusTranslationRepository
        extends JpaRepository<SupportTicketStatusTranslation, Integer> {

    Optional<SupportTicketStatusTranslation>
    findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_Code(
        Integer statusId,
        String languageCode
    );

    List<SupportTicketStatusTranslation>
    findBySupportTicketStatus_SupportTicketStatusId(
        Integer statusId
    );

    boolean existsBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    Optional<SupportTicketStatusTranslation>
    findBySupportTicketStatus_SupportTicketStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    void deleteBySupportTicketStatus_SupportTicketStatusId(
        Integer statusId
    );

    Optional<SupportTicketStatusTranslation>
    findBySupportTicketStatusAndLanguage(
        SupportTicketStatus status,
        Language language
    );

    Optional<SupportTicketStatusTranslation>
    findFirstBySupportTicketStatus_SupportTicketStatusId(
        Integer statusId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndSupportTicketStatus_SupportTicketStatusIdNot(
        String name,
        Integer languageId,
        Integer supportTicketStatusId
    );
}
