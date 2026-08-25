package com.axher.backend.language.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.language.entities.Language;

public interface LanguageRepository extends JpaRepository<Language, Integer> {
    
    Page<Language> findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrNativeNameContainingIgnoreCase(
            String code,
            String name,
            String nativeName,
            Pageable pageable
    );

    Optional<Language> findByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCase(String code);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNativeNameIgnoreCase(String nativeName);

    List<Language> findByActiveTrueOrderByNameAsc();
}
