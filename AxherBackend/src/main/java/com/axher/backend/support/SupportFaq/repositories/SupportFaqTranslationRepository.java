package com.axher.backend.support.SupportFaq.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.language.entities.Language;
import com.axher.backend.support.SupportFaq.entities.SupportFaq;
import com.axher.backend.support.SupportFaq.entities.SupportFaqTranslation;

public interface SupportFaqTranslationRepository extends JpaRepository<SupportFaqTranslation, Integer> {
   
    Optional<SupportFaqTranslation>
    findBySupportFaq_SupportFaqIdAndLanguage_Code(
        Integer faqId,
        String languageCode
    );

    List<SupportFaqTranslation>
    findBySupportFaq_SupportFaqId(
        Integer faqId
    );

    boolean existsBySupportFaq_SupportFaqIdAndLanguage_LanguageId(
        Integer faqId,
        Integer languageId
    );

    Optional<SupportFaqTranslation>
    findBySupportFaq_SupportFaqIdAndLanguage_LanguageId(
        Integer faqId,
        Integer languageId
    );

    void deleteBySupportFaq_SupportFaqId(
        Integer faqId
    );

    Optional<SupportFaqTranslation>
    findBySupportFaqAndLanguage(
        SupportFaq faq,
        Language language
    );

    Optional<SupportFaqTranslation>
    findFirstBySupportFaq_SupportFaqId(
        Integer faqId
    );
}
