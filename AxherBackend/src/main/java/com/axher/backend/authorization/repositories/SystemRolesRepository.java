package com.axher.backend.authorization.repositories;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.authorization.entities.SystemRoles;

public interface SystemRolesRepository extends JpaRepository<SystemRoles, Integer> {
    Optional<SystemRoles> findByRoleName(String roleName);

    boolean existsByRoleName(String roleName);

    Page<SystemRoles> findByRoleNameContainingIgnoreCase(String roleName, Pageable pageable);

}
