package com.axher.backend.billing.payment.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.billing.payment.entities.PaymentStatus;

public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer> {

    boolean existsByCode(String code);

    boolean existsByNameIgnoreCase(String name);

    Optional<PaymentStatus> findByCode(String code);

    Page<PaymentStatus> findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String code,
        String name,
        String description,
        Pageable pageable
    );
}

