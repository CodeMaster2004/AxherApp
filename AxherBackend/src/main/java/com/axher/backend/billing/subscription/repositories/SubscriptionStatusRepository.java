package com.axher.backend.billing.subscription.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.subscription.entities.SubscriptionStatus;

public interface SubscriptionStatusRepository extends JpaRepository<SubscriptionStatus, Integer> {

    boolean existsByCode(String code);
    boolean existsByNameIgnoreCase(String name);
    Optional<SubscriptionStatus> findByCode(String code);

    Page<SubscriptionStatus> findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String code,
            String name,
            String description,
            Pageable pageable
    );
}
