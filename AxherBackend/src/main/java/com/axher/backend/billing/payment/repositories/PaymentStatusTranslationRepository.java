package com.axher.backend.billing.payment.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.payment.entities.PaymentStatus;
import com.axher.backend.billing.payment.entities.PaymentStatusTranslation;
import com.axher.backend.language.entities.Language;

public interface PaymentStatusTranslationRepository
        extends JpaRepository<PaymentStatusTranslation, Integer> {

    Optional<PaymentStatusTranslation>
    findByPaymentStatus_PaymentStatusIdAndLanguage_Code(
        Integer statusId,
        String languageCode
    );

    List<PaymentStatusTranslation>
    findByPaymentStatus_PaymentStatusId(
        Integer statusId
    );

    boolean existsByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    Optional<PaymentStatusTranslation>
    findByPaymentStatus_PaymentStatusIdAndLanguage_LanguageId(
        Integer statusId,
        Integer languageId
    );

    void deleteByPaymentStatus_PaymentStatusId(
        Integer statusId
    );

    Optional<PaymentStatusTranslation>
    findByPaymentStatusAndLanguage(
        PaymentStatus status,
        Language language
    );

    Optional<PaymentStatusTranslation>
    findFirstByPaymentStatus_PaymentStatusId(
        Integer statusId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageId(
        String name,
        Integer languageId
    );

    boolean existsByNameIgnoreCaseAndLanguage_LanguageIdAndPaymentStatus_PaymentStatusIdNot(
        String name,
        Integer languageId,
        Integer statusId
    );
}
