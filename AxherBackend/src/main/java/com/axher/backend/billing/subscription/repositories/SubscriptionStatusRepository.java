package com.axher.backend.billing.subscription.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.billing.subscription.entities.SubscriptionStatus;

public interface SubscriptionStatusRepository extends JpaRepository<SubscriptionStatus, Integer> {

    boolean existsByCode(String code);
    Optional<SubscriptionStatus> findByCode(String code);

    @Query("""
    SELECT DISTINCT ss
    FROM SubscriptionStatus ss
    LEFT JOIN ss.translations t
    WHERE
        LOWER(ss.code) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<SubscriptionStatus> search(
        @Param("search") String search,
        Pageable pageable
    );

}
