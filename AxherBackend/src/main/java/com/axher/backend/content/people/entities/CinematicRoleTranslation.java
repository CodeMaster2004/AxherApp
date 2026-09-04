package com.axher.backend.content.people.entities;

import java.time.Instant;

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
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(
    name = "cinematic_role_translations",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_cinematic_role_translation_language",
            columnNames = {
                "cinematic_role_id",
                "language_id"
            }
        )
    }
)
public class CinematicRoleTranslation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cinematicRoleTranslationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "cinematic_role_id",
        nullable = false
    )
    private CinematicRole cinematicRole;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "language_id",
        nullable = false
    )
    private Language language;

    @NotBlank
    @Size(max = 50)
    @Column(
        nullable = false,
        length = 50
    )
    private String name;

    @Size(max = 200)
    @Column(length = 200)
    private String description;

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
}
