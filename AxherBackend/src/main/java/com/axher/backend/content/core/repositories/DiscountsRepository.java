package com.axher.backend.content.core.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.Discounts;

public interface DiscountsRepository extends JpaRepository<Discounts, Integer> {

    Page<Discounts> findByDiscountTypeContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String discountType,
        String description,
        Pageable pageable
    );

}
