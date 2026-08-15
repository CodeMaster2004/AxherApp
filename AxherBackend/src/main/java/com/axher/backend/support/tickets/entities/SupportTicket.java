package com.axher.backend.support.tickets.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.axher.backend.billing.subscription.entities.SubscriptionPayments;
import com.axher.backend.billing.subscription.entities.Subscriptions;
import com.axher.backend.users.entities.Users;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "support_tickets")
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supportTicketId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "support_category_id", nullable = false)
    private SupportCategory supportCategory;

    @ManyToOne
    @JoinColumn(name = "support_ticket_status_id", nullable = false)
    private SupportTicketStatus supportTicketStatus;

    private String subject;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private Subscriptions subscription;

    @ManyToOne
    @JoinColumn(name = "subscription_payment_id")
    private SubscriptionPayments subscriptionPayment;

    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;

    private LocalDateTime resolvedAt;

    private LocalDateTime closedAt;
    
}
