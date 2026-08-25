package com.axher.backend.support.reports.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.support.reports.entities.ReportStatus;

public interface ReportStatusRepository extends JpaRepository<ReportStatus, Integer> {

    boolean existsByCode(String code);
    Optional<ReportStatus> findByCode(String code);

    @Query("""
        SELECT DISTINCT rs
        FROM ReportStatus rs
        LEFT JOIN rs.translations t
        WHERE t.language.languageId = :languageId
          AND (
                LOWER(rs.code) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
              )
        """)
    Page<ReportStatus> search(
            @Param("search") String search,
            @Param("languageId") Integer languageId,
            Pageable pageable
    );
}
