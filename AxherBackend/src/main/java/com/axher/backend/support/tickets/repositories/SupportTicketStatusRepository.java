package com.axher.backend.support.tickets.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportTicketStatus;

public interface SupportTicketStatusRepository extends JpaRepository<SupportTicketStatus, Integer> {
    Page<SupportTicketStatus>
    findByCodeContainingIgnoreCaseOrNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String code,
        String name,
        String description,
        Pageable pageable
    );

    Optional<SupportTicketStatus> findByCode(String code);

    boolean existsByCode(String code);

    boolean existsByNameIgnoreCase(String name);
}
