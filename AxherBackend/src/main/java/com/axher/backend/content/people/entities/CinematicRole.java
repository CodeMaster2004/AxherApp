package com.axher.backend.content.people.entities;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "cinematic_roles")
public class CinematicRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cinematicRoleId;

    @Column(length = 50, nullable = false, unique = true)
    private String code;

    @OneToMany(
        mappedBy = "cinematicRole",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.LAZY
    )
    private Set<CinematicRoleTranslation> translations = new HashSet<>();

}

