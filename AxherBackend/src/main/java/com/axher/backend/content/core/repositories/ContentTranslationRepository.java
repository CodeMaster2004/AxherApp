package com.axher.backend.content.core.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.Content;
import com.axher.backend.content.core.entities.ContentTranslation;
import com.axher.backend.language.entities.Language;

public interface ContentTranslationRepository extends JpaRepository<ContentTranslation, Integer>{
    
    Optional<ContentTranslation> findByContent_ContentIdAndLanguage_Code(
            Integer contentId,
            String languageCode
    );

    List<ContentTranslation> findByContent_ContentId(
        Integer contentId
    );

    boolean existsByContent_ContentIdAndLanguage_LanguageId(
        Integer contentId,
        Integer languageId
    );

    Optional<ContentTranslation>
    findByContent_ContentIdAndLanguage_LanguageId(
        Integer contentId,
        Integer languageId
    );

    void deleteByContent_ContentId(Integer contentId);

    Optional<ContentTranslation> findByContentAndLanguage(
            Content content,
            Language language
    );

   
}
