package com.axher.backend.users.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.authorization.DTOs.SystemRoleDto;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.service.SystemRolesService;
import com.axher.backend.shared.exception.RoleNotFoundException;
import com.axher.backend.shared.exception.UserNotFoundException;
import com.axher.backend.users.entities.UserRoleAssignments;
import com.axher.backend.users.entities.UserRoleId;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UserRoleAssignmentsRepository;
import com.axher.backend.users.repositories.UsersRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserRoleAssignmentsService {

    private final UserRoleAssignmentsRepository repository;
    private final SystemRolesService systemRolesService;
    private final UsersRepository usersRepository;

    /** Obtener roles de un usuario */
    @Transactional(readOnly = true)
    public List<SystemRoleDto> getRolesByUser(Integer userId) {
        return repository.findByUser_UserId(userId).stream()
                .map(ura -> new SystemRoleDto(
                        ura.getRole().getSystemRoleId(),
                        ura.getRole().getRoleName()))
                .toList();
    }

    /**
     * Asigna un rol a un usuario
     * @param userId ID del usuario
     * @param roleName Nombre del rol
     * @return true si se asignó el rol, false si ya existía
     */
    @Transactional
    public boolean assignRole(Integer userId, String roleName) {
        // Validar existencia del rol
        SystemRoles role = systemRolesService.findByRoleName(roleName)
            .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado: " + roleName));

        // Validar existencia del usuario
        Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("Usuario no encontrado: " + userId));

        // Revisar si ya existe la asignación
        boolean exists = repository.existsByUser_UserIdAndRole_SystemRoleId(userId, role.getSystemRoleId());
        if (exists) return false; // ya asignado

        // Crear la asignación
        UserRoleAssignments assignments = new UserRoleAssignments();
        assignments.setId(new UserRoleId(userId, role.getSystemRoleId()));
        assignments.setRole(role);
        assignments.setUser(user);
        assignments.setAssignedAt(LocalDateTime.now());
        repository.save(assignments);

        return true;
    }

    /** Asignar múltiples roles */
    @Transactional
    public void assignMultipleRoles(Integer userId, List<String> roleNames) {

        for (String roleName : roleNames) {
            assignRole(userId, roleName);
        }
    }

        /**
     * Quita un rol a un usuario
     * @param userId ID del usuario
     * @param roleName Nombre del rol a quitar
     * @return true si se quitó el rol, false si el usuario no tenía ese rol
     */
    @Transactional
    public boolean removeRole(Integer userId, String roleName) {
        // Validar existencia del rol
        SystemRoles role = systemRolesService.findByRoleName(roleName)
            .orElseThrow(() -> new RoleNotFoundException("Rol no encontrado: " + roleName));

        // Validar existencia del usuario (opcional, si quieres ser estricto)
        if (!usersRepository.existsById(userId)) {
            throw new UserNotFoundException("Usuario no encontrado: " + userId);
        }

        // Crear el ID compuesto para buscar la asignación
        UserRoleId id = new UserRoleId(userId, role.getSystemRoleId());

        // Verificar si existe la asignación
        if (!repository.existsById(id)) {
            return false; // El usuario no tenía ese rol
        }

        // Eliminar la asignación
        repository.deleteById(id);
        
        return true; // Se quitó exitosamente
    }
     /** Quitar múltiples roles */
    @Transactional
    public void removeMultipleRoles(Integer userId, List<String> roleNames) {

        for (String roleName : roleNames) {
            removeRole(userId, roleName);
        }
    }
}

