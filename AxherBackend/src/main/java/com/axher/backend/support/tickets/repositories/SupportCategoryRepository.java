package com.axher.backend.support.tickets.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.support.tickets.entities.SupportCategory;

public interface SupportCategoryRepository extends JpaRepository<SupportCategory, Integer> {
    Optional<SupportCategory> findByCode(String code);

    boolean existsByCode(String code);


    @Query("""
        SELECT DISTINCT sc
        FROM SupportCategory sc
        LEFT JOIN sc.translations t
        WHERE
            LOWER(sc.code) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<SupportCategory> search(
        @Param("search") String search,
        Pageable pageable
    );
}
