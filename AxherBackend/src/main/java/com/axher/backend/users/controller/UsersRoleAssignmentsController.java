package com.axher.backend.users.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.authorization.DTOs.AssignRolesRequestDto;
import com.axher.backend.authorization.DTOs.SystemRoleDto;
import com.axher.backend.users.service.UserRoleAssignmentsService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

//@PreAuthorize("hasAuthority('USER_ROLE:MANAGE')") // Solo usuarios con permiso pueden gestionar asignaciones de roles
@RestController
@RequestMapping("/api/user-roles")
@RequiredArgsConstructor
public class UsersRoleAssignmentsController {

    private final UserRoleAssignmentsService service;

    
    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('USER_ROLE:VIEW')")
    public ResponseEntity<List<SystemRoleDto>> getRolesByUser(@PathVariable Integer userId){
        List<SystemRoleDto> roles = service.getRolesByUser(userId);
        return ResponseEntity.ok(roles);
    }

    @PostMapping("/{userId}/{roleName}")
    @PreAuthorize("hasAuthority('USER_ROLE:ASSIGN')") // Permiso para asignar roles
    public ResponseEntity<String> assignRole(
        @PathVariable Integer userId,
        @PathVariable String roleName
    ){
        boolean assigned = service.assignRole(userId, roleName);
        if(assigned){
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("Rol '" + roleName + "' asignado al usuario " + userId);
        }else {
            return ResponseEntity.status(HttpStatus.OK)
                    .body("El usuario " + userId + " ya tiene el rol '" + roleName + "'");
        }
    }

    // Asignar múltiples roles con DTO
    @PostMapping("/{userId}/bulk")
    @PreAuthorize("hasAuthority('USER_ROLE:ASSIGN')")
    public ResponseEntity<String> assignRoles(
        @PathVariable Integer userId,
        @Valid @RequestBody AssignRolesRequestDto dto
    ) {
        service.assignMultipleRoles(userId, dto.getRoles());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body("Roles asignados correctamente");
    }

    @DeleteMapping("/{userId}/{roleName}")
    @PreAuthorize("hasAuthority('USER_ROLE:REMOVE')") // Permiso para remover roles
    public ResponseEntity<String> removeRole(
        @PathVariable Integer userId,
        @PathVariable String roleName
    ){
        boolean removed = service.removeRole(userId, roleName);
        if(removed){
            return ResponseEntity.ok("Rol '" + roleName + "' removido del usuario " + userId);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("El usuario " + userId + " no tiene el rol '" + roleName + "'");
        }
    }

    // Quitar múltiples roles con DTO
    @DeleteMapping("/{userId}/bulk")
    @PreAuthorize("hasAuthority('USER_ROLE:REMOVE')")
    public ResponseEntity<String> removeRoles(
        @PathVariable Integer userId,
        @Valid @RequestBody AssignRolesRequestDto dto
    ) {
        service.removeMultipleRoles(userId, dto.getRoles());
        return ResponseEntity.ok("Roles removidos correctamente");
    }
    
}
