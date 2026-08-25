package com.axher.backend.billing.payment.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.billing.payment.entities.PaymentStatus;

public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer> {

    boolean existsByCode(String code);


    Optional<PaymentStatus> findByCode(String code);

    @Query("""
        SELECT DISTINCT ps
        FROM PaymentStatus ps
        LEFT JOIN ps.translations t
        WHERE
            LOWER(ps.code) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
        """)
    Page<PaymentStatus> search(
        @Param("search") String search,
        Pageable pageable
    );
}

