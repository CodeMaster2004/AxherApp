package com.axher.backend.authorization.entities;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
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
@Table(name = "system_permissions")
public class SystemPermissions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer systemPermissionId;

    @Column(length = 100, nullable = false)
    private String moduleName;

    @Column(length = 50, nullable = false)
    private String actionName;

    @Column(length = 150, nullable = false, unique = true, insertable = false, updatable = false)
    private String permissionName;

    @OneToMany(mappedBy = "permission", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @JsonIgnore
    private Set<RolePermissionAssignments> roles = new HashSet<>();
    
    @PrePersist
    @PreUpdate
    private void setPermissionName() {
        this.permissionName = moduleName + ":" + actionName;
    }
}
