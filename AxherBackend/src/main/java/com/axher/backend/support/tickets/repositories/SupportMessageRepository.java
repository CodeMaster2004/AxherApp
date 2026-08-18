package com.axher.backend.support.tickets.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.support.tickets.entities.SupportMessage;
import com.axher.backend.support.tickets.entities.SupportTicket;

public interface SupportMessageRepository extends JpaRepository<SupportMessage, Long> {
    List<SupportMessage> findByTicketOrderBySentAtAsc(
        SupportTicket ticket
    );
}
