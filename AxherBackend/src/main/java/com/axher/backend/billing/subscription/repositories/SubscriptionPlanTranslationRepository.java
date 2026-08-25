package com.axher.backend.billing.subscription.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionPlanTranslation;
import com.axher.backend.billing.subscription.entities.SubscriptionPlans;
import com.axher.backend.language.entities.Language;

public interface SubscriptionPlanTranslationRepository
        extends JpaRepository<SubscriptionPlanTranslation, Integer> {

    Optional<SubscriptionPlanTranslation>
    findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_Code(
        Integer subscriptionPlanId,
        String languageCode
    );

    List<SubscriptionPlanTranslation>
    findBySubscriptionPlan_SubscriptionPlanId(
        Integer subscriptionPlanId
    );

    boolean
    existsBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
        Integer subscriptionPlanId,
        Integer languageId
    );

    Optional<SubscriptionPlanTranslation>
    findBySubscriptionPlan_SubscriptionPlanIdAndLanguage_LanguageId(
        Integer subscriptionPlanId,
        Integer languageId
    );

    void deleteBySubscriptionPlan_SubscriptionPlanId(
        Integer subscriptionPlanId
    );

    Optional<SubscriptionPlanTranslation>
    findBySubscriptionPlanAndLanguage(
        SubscriptionPlans subscriptionPlan,
        Language language
    );

    Optional<SubscriptionPlanTranslation>
    findFirstBySubscriptionPlan_SubscriptionPlanId(
        Integer subscriptionPlanId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean
    existsByNameIgnoreCaseAndLanguage_LanguageIdAndSubscriptionPlan_SubscriptionPlanIdNot(
        String name,
        Integer languageId,
        Integer subscriptionPlanId
    );

    Optional<SubscriptionPlanTranslation>
    findByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );
}
