package com.axher.backend.users.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.users.entities.UserRoleAssignments;
import com.axher.backend.users.entities.UserRoleId;

public interface UserRoleAssignmentsRepository extends JpaRepository<UserRoleAssignments, UserRoleId> {
    
        // Devuelve todas las asignaciones de un usuario
    List<UserRoleAssignments> findByUser_UserId(Integer userId);

    // Verifica si ya existe la asignación para un usuario y un rol
    boolean existsByUser_UserIdAndRole_SystemRoleId(Integer userId, Integer roleId);

     @Query("""
        SELECT ura.role.roleName
        FROM UserRoleAssignments ura
        WHERE ura.user.userId = :userId
    """)
    List<String> findRoleNamesByUserId(Integer userId);

    @Query("""
        SELECT ura.role
        FROM UserRoleAssignments ura
        WHERE ura.user.userId = :userId
    """)
    List<SystemRoles> findRolesByUserId(Integer userId);
}
