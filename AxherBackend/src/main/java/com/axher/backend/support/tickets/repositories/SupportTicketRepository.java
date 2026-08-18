package com.axher.backend.support.tickets.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.axher.backend.support.tickets.entities.SupportTicket;
import com.axher.backend.users.entities.Users;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer>,
    JpaSpecificationExecutor<SupportTicket>{
    
    Page<SupportTicket> findByUserOrderByCreatedAtDesc(
        Users user,
        Pageable pageable
    );
}
