package com.axher.backend.support.tickets.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportCategory;

public interface SupportCategoryRepository extends JpaRepository<SupportCategory, Integer> {
    Optional<SupportCategory> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByNameIgnoreCase(String name);

    Page<SupportCategory>
    findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String code,
        String name,
        String description,
        Pageable pageable
    );
}
