package com.axher.backend.content.people.entities;


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
import jakarta.validation.constraints.Min;
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
    name = "content_person_roles",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uq_content_person_role",
            columnNames = {
                "content_id",
                "person_id",
                "cinematic_role_id",
                "character_name"
            }
        )
    }
)
public class ContentPersonRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contentPersonRoleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "content_id",
        nullable = false
    )
    private Content content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "person_id",
        nullable = false
    )
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "cinematic_role_id",
        nullable = false
    )
    private CinematicRole cinematicRole;

    @Size(max = 100)
    @Column(
        name = "character_name",
        length = 100
    )
    private String characterName;

    @Min(0)
    @Column(
        name = "order_index",
        nullable = false
    )
    private Integer orderIndex = 0;
}