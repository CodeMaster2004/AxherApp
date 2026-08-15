package com.axher.backend.support.tickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportTicket;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer> {
    
}
