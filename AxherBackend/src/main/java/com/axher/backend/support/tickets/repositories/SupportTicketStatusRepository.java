package com.axher.backend.support.tickets.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.support.tickets.entities.SupportTicketStatus;

public interface SupportTicketStatusRepository extends JpaRepository<SupportTicketStatus, Integer> {

    Optional<SupportTicketStatus> findByCode(String code);

    boolean existsByCode(String code);

    @Query("""
        SELECT DISTINCT s
        FROM SupportTicketStatus s
        LEFT JOIN s.translations t
        WHERE
            LOWER(s.code) LIKE LOWER(CONCAT('%', :search, '%'))
            OR (
                t.language.languageId = :languageId
                AND (
                    LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
                    OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
                )
            )
    """)
    Page<SupportTicketStatus> search(
            @Param("search") String search,
            @Param("languageId") Integer languageId,
            Pageable pageable
    );

}
