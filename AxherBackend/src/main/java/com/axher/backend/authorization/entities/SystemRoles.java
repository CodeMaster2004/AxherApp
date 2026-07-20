package com.axher.backend.authorization.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.axher.backend.users.entities.UserRoleAssignments;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "system_roles")
public class SystemRoles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer systemRoleId;

    @Column(length = 50, nullable = false, unique = true)
    private String roleName;

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private Set<UserRoleAssignments> userAssignments = new HashSet<>();

    @OneToMany(mappedBy = "role")
    @JsonIgnore
    private Set<RolePermissionAssignments> rolePermissionAssignments = new HashSet<>();


    // Otros campos y métodos...
}
