package com.axher.backend.support.tickets.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportMessage;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    
}
