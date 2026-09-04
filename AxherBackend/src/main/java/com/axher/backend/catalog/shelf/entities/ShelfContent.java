package com.axher.backend.catalog.shelf.entities;

import java.time.Instant;

import com.axher.backend.content.core.entities.Content;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    name = "shelf_contents",
    uniqueConstraints = {
        @UniqueConstraint(
            columnNames = {
                "content_shelf_id",
                "content_id"
            }
        ),@UniqueConstraint(
            columnNames = {
                "content_shelf_id",
                "position"
            }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShelfContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer shelfContentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_shelf_id", nullable = false)
    private ContentShelf contentShelf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(nullable = false)
    private Integer position;

    private Instant createdAt;
    
}
