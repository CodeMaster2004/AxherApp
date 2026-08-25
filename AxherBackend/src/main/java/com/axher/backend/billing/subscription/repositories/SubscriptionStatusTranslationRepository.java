package com.axher.backend.billing.subscription.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionStatus;
import com.axher.backend.billing.subscription.entities.SubscriptionStatusTranslation;
import com.axher.backend.language.entities.Language;

public interface SubscriptionStatusTranslationRepository
        extends JpaRepository<SubscriptionStatusTranslation, Integer> {

    Optional<SubscriptionStatusTranslation>
    findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_Code(
        Integer statusId,
        String languageCode
    );

    List<SubscriptionStatusTranslation>
    findBySubscriptionStatus_SubscriptionStatusId(
        Integer statusId
    );

    boolean existsBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    Optional<SubscriptionStatusTranslation>
    findBySubscriptionStatus_SubscriptionStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    void deleteBySubscriptionStatus_SubscriptionStatusId(
        Integer statusId
    );

    Optional<SubscriptionStatusTranslation>
    findBySubscriptionStatusAndLanguage(
        SubscriptionStatus status,
        Language language
    );

    Optional<SubscriptionStatusTranslation>
    findFirstBySubscriptionStatus_SubscriptionStatusId(
        Integer statusId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndSubscriptionStatus_SubscriptionStatusIdNot(
        String name,
        Integer languageId,
        Integer statusId
    );
}