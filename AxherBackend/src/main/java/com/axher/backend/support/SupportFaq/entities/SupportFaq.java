package com.axher.backend.support.SupportFaq.entities;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.axher.backend.support.tickets.entities.SupportCategory;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "support_faqs")
public class SupportFaq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer supportFaqId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "support_category_id",
        nullable = false
    )
    private SupportCategory supportCategory;

    @Column(
        name = "display_order",
        nullable = false
    )
    private Integer displayOrder = 0;

    @Column(
        nullable = false
    )
    private Boolean active = true;

    @CreationTimestamp
    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private Instant createdAt;

    @UpdateTimestamp
    @Column(
        name = "updated_at",
        nullable = false
    )
    private Instant updatedAt;

    @OneToMany(
        mappedBy = "supportFaq",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<SupportFaqTranslation> translations = new HashSet<>();
    
}
