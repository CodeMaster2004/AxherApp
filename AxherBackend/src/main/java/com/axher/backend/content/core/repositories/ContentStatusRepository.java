package com.axher.backend.content.core.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.ContentStatus;

public interface ContentStatusRepository extends JpaRepository<ContentStatus, Integer> {
    boolean existsByCode(String status);

    boolean existsByNameIgnoreCase(String name);

    Optional<ContentStatus> findByCode(String code);

    Page<ContentStatus> findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String code,
            String name,
            String description,
            Pageable pageable
    );


}
