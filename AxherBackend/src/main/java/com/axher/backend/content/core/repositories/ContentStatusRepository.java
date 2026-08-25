package com.axher.backend.content.core.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.content.core.entities.ContentStatus;

public interface ContentStatusRepository extends JpaRepository<ContentStatus, Integer> {
    boolean existsByCode(String status);

    Optional<ContentStatus> findByCode(String code);

    @Query("""
        SELECT DISTINCT cs
        FROM ContentStatus cs
        LEFT JOIN cs.translations t
        WHERE
            t.language.languageId = :languageId
            AND (
                LOWER(cs.code) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
            )
    """)
    Page<ContentStatus> search(
        @Param("search") String search,
        @Param("languageId") Integer languageId,
        Pageable pageable
    );


}
