package com.axher.backend.content.core.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.content.core.entities.ContentStatus;

public interface ContentStatusRepository extends JpaRepository<ContentStatus, Integer> {
    boolean existsByStatus(String status);

    Optional<ContentStatus> findByStatus(String status);

    Page<ContentStatus> findByStatusContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String status,
        String description,
        Pageable pageable
    );


}
