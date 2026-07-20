package com.axher.backend.content.people.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "cinematic_roles")
public class CinematicRoles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cinematicRoleId;

    @Column(length = 50, nullable = false)
    private String name;

}

