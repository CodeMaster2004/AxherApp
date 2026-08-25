package com.axher.backend.support.tickets.entities;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "support_tickets_status")
public class SupportTicketStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supportTicketStatusId;

    @Column(length = 30, nullable = false, unique = true)
    private String code;

    @OneToMany(
        mappedBy = "supportTicketStatus",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<SupportTicketStatusTranslation> translations =
            new HashSet<>();
    
    
}
