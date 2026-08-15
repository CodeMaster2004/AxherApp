package com.axher.backend.support.reports.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.reports.entities.ReportStatus;

public interface ReportStatusRepository extends JpaRepository<ReportStatus, Integer> {

    boolean existsByCode(String code);
    boolean existsByNameIgnoreCase(String name);
    Optional<ReportStatus> findByCode(String code);

    Page<ReportStatus> findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String code,
            String name,
            String description,
            Pageable pageable
    );
}
