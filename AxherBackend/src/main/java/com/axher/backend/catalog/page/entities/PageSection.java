package com.axher.backend.catalog.page.entities;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import com.axher.backend.catalog.shelf.entities.ContentShelf;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "page_sections",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {"page", "display_order"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PageSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer pageSectionId;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private PageType page;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    private PageSectionType type;

    @Column(nullable = false)
    private Integer displayOrder;

    @Column(nullable = false)
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_shelf_id")
    private ContentShelf contentShelf;

    @CreationTimestamp
    @Column(nullable = false)
    private Instant createdAt;
    
}
