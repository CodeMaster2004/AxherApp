package com.axher.backend.catalog.shelf.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.axher.backend.language.entities.Language;

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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "content_shelf_translations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_content_shelf_translation_language",
            columnNames = {
                "content_shelf_id",
                "language_id"
            }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ContentShelfTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer contentShelfTranslationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "content_shelf_id",
        nullable = false
    )
    private ContentShelf contentShelf;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "language_id",
        nullable = false
    )
    private Language language;

    @NotBlank
    @Size(max = 100)
    @Column(
        nullable = false,
        length = 100
    )
    private String name;

    @CreationTimestamp
    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;
}
