package com.axher.backend.authorization.repositories;

import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.authorization.entities.SystemPermissions;
import com.axher.backend.users.entities.Users;


public interface SystemPermissionsRepository extends JpaRepository<SystemPermissions, Integer>{

    Optional<SystemPermissions> findByPermissionName(String permissionName);

    Page<SystemPermissions> findByPermissionNameContainingIgnoreCase(String search, Pageable pageable);

    boolean existsByModuleNameAndActionName(String moduleName, String actionName);

    // Obtener todos los permisos de un usuario según sus roles
    @Query("""
    select distinct p.permissionName
    from UserRoleAssignments ura
    join ura.role r
    join r.rolePermissionAssignments rpa
    join rpa.permission p
    where ura.user = :user
""")
Set<String> findPermissionsByUser(Users user);

}

