package com.axher.backend.billing.subscription.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionPlans;

public interface SubscriptionPlansRepository extends JpaRepository<SubscriptionPlans, Integer> {

    boolean existsByNameIgnoreCase(String name);

    Optional<SubscriptionPlans> findByNameIgnoreCase(String name);

    Page<SubscriptionPlans> findByNameContainingIgnoreCase(
        String name,
        Pageable pageable
    );
}
