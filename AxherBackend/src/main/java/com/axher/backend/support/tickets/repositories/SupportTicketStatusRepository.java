package com.axher.backend.support.tickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportTicketStatus;

public interface SupportTicketStatusRepository extends JpaRepository<SupportTicketStatus, Integer> {
    
}
