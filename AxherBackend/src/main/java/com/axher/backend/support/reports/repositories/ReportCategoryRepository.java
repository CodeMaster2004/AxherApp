package com.axher.backend.support.reports.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.support.reports.entities.ReportCategory;

public interface ReportCategoryRepository
        extends JpaRepository<ReportCategory, Integer> {

    boolean existsByCode(String code);

    Optional<ReportCategory> findByCode(String code);

    Page<ReportCategory> findByCodeContainingIgnoreCase(
            String code,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT rc
        FROM ReportCategory rc
        LEFT JOIN rc.translations t
        WHERE t.language.languageId = :languageId
          AND (
                LOWER(rc.code) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
              )
        """)
    Page<ReportCategory> search(
            @Param("search") String search,
            @Param("languageId") Integer languageId,
            Pageable pageable
    );
}
