package com.axher.backend.billing.subscription.repositories;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.axher.backend.billing.subscription.entities.SubscriptionPlans;

public interface SubscriptionPlansRepository extends JpaRepository<SubscriptionPlans, Integer> {

    @Query("""
        SELECT DISTINCT sp
        FROM SubscriptionPlans sp
        LEFT JOIN sp.translations t
        WHERE
            LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))
        """)
    Page<SubscriptionPlans> search(
        @Param("search") String search,
        Pageable pageable
    );
}
