package com.axher.backend.catalog.banner.entities;

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
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "hero_banner_translations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_hero_banner_translation_language",
            columnNames = {
                "hero_banner_id",
                "language_id"
            }
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HeroBannerTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer heroBannerTranslationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hero_banner_id", nullable = false)
    private HeroBanner heroBanner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "language_id", nullable = false)
    private Language language;

    @Size(max = 100)
    @Column(name = "title_override", length = 100)
    private String titleOverride;

    @Column(
        name = "description_override",
        columnDefinition = "TEXT"
    )
    private String descriptionOverride;

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
