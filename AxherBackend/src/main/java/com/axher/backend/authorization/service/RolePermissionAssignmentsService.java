package com.axher.backend.authorization.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.authorization.entities.RolePermissionAssignments;
import com.axher.backend.authorization.entities.RolePermissionId;
import com.axher.backend.authorization.entities.SystemPermissions;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.repositories.RolePermissionAssignmentsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RolePermissionAssignmentsService {
    private final RolePermissionAssignmentsRepository repository;
    private final PermissionEventService permissionEventService;

    @Cacheable(value = "rolePermissions", key = "#role.systemRoleId")
    public List<String> getPermissionNamesByRole(SystemRoles role) {
        return repository.findByRoleSystemRoleId(role.getSystemRoleId())
            .stream()
            .map(rp -> rp.getPermission().getPermissionName())
            .collect(Collectors.toList());
    }

    public boolean assignPermission(SystemRoles role, SystemPermissions permissions){
        RolePermissionId id = new RolePermissionId(role.getSystemRoleId(), permissions.getSystemPermissionId());
        if(repository.existsById(id)) return false; // ya asignado

        RolePermissionAssignments rpa = new RolePermissionAssignments();
        rpa.setId(id);
        rpa.setRole(role);
        rpa.setPermission(permissions);
        rpa.setAssignedAt(Instant.now());
        repository.save(rpa);
        return true;
    }

    public boolean removePermission(SystemRoles role, SystemPermissions permissions){
        RolePermissionId id = new RolePermissionId(role.getSystemRoleId(), permissions.getSystemPermissionId());

        if(!repository.existsById(id)) return false;

        repository.deleteById(id);
        return true;
    }

    public void assignMultiplePermissions(SystemRoles role, List<SystemPermissions> permissions){
        for(SystemPermissions p : permissions){
            assignPermission(role, p);
        }
    }

    public void removeMultiplePermissions(SystemRoles role, List<SystemPermissions> permissions){
        for(SystemPermissions p : permissions){
            removePermission(role, p);
        }
    }

   @CacheEvict(value = "rolePermissions", key = "#role.systemRoleId")
    public void updateRolePermissions(SystemRoles role, List<SystemPermissions> addList, List<SystemPermissions> removeList){
        if(removeList != null){
            removeMultiplePermissions(role, removeList);
        }

        if(addList != null){
            assignMultiplePermissions(role, addList);
        }

        // 🔔 Notificar a usuarios afectados
        role.getUserAssignments().forEach(user -> {
            permissionEventService.sendPermissionUpdate(user.getUser().getUserId());
        });
    }

    
}

