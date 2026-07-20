package com.axher.backend.authorization.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.axher.backend.authorization.entities.RolePermissionAssignments;
import com.axher.backend.authorization.entities.RolePermissionId;


public interface RolePermissionAssignmentsRepository extends JpaRepository<RolePermissionAssignments, RolePermissionId>{
    List<RolePermissionAssignments> findByRoleSystemRoleId(Integer roleId);
}
