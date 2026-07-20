package com.axher.backend.authorization.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.authorization.DTOs.AssignPermissionsRequestDto;
import com.axher.backend.authorization.entities.SystemPermissions;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.service.RolePermissionAssignmentsService;
import com.axher.backend.authorization.service.SystemPermissionsService;
import com.axher.backend.authorization.service.SystemRolesService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/role-permissions")
@RequiredArgsConstructor
public class RolePermissionAssignmentsController {
    private final RolePermissionAssignmentsService service;
    private final SystemRolesService rolesService;
    private final SystemPermissionsService permissionsService;

    @GetMapping("/{roleId}")
    @PreAuthorize("hasAuthority('ROLE_PERMISSION:VIEW')") // Permiso para ver permisos asignados a un rol
    public ResponseEntity<List<String>> getPermissions(@PathVariable Integer roleId){
        SystemRoles role = rolesService.findById(roleId);
        return ResponseEntity.ok(service.getPermissionNamesByRole(role));
    }

    @PostMapping("/{roleId}/bulk")
    @PreAuthorize("hasAuthority('ROLE_PERMISSION:EDIT')") // Permiso para editar permisos de un rol
    public ResponseEntity<String> updatePermissions(
            @PathVariable Integer roleId,
            @RequestBody AssignPermissionsRequestDto dto
    ){
        SystemRoles role = rolesService.findById(roleId);

        List<SystemPermissions> addList = permissionsService.findAllByIds(dto.getAddPermissionIds());
        List<SystemPermissions> removeList = permissionsService.findAllByIds(dto.getRemovePermissionIds());

        service.updateRolePermissions(role, addList, removeList);

        return ResponseEntity.ok("Permisos actualizados correctamente");
    }
}
