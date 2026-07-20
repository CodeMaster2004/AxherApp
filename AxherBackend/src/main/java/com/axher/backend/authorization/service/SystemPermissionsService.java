package com.axher.backend.authorization.service;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.authorization.entities.SystemPermissions;
import com.axher.backend.authorization.repositories.SystemPermissionsRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SystemPermissionsService {

    private final SystemPermissionsRepository repository;

    public Page<SystemPermissions> findAll(Pageable pageable, String search){
        if(search == null || search.isEmpty()){
            return repository.findAll(pageable);
        }

        return repository.findByPermissionNameContainingIgnoreCase(search, pageable);
    }

    @Cacheable(value = "permissions", key = "#id")
    public SystemPermissions findById(Integer id){
        System.out.println("🔥 CONSULTANDO DB (NO CACHE)");
        return repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Permiso no encontrado: " + id));
    }

    @CacheEvict(value = {"permissions", "permissionsByIds"}, allEntries = true)
    public SystemPermissions create(SystemPermissions permissions) {
        
        String normalizedModule = permissions.getModuleName().trim().toUpperCase();
        String normalizedAction = permissions.getActionName().trim().toUpperCase();

        String permissionName = normalizedModule + ":" + normalizedAction;

        if(repository.findByPermissionName(permissionName).isPresent()){
            throw new DuplicateResourceException("El permiso ya existe: " + permissionName);
        }
        permissions.setPermissionName(permissionName); // si tu entidad tiene campo persistido

        return repository.save(permissions);
    }

    @CacheEvict(value = {"permissions", "permissionsByIds"}, allEntries = true)
    public SystemPermissions update(Integer id, SystemPermissions updatedPermission) {

        SystemPermissions existing = findById(id);

        boolean changed = false;

        if (updatedPermission.getModuleName() != null && !updatedPermission.getModuleName().isBlank()) {
            existing.setModuleName(updatedPermission.getModuleName().trim().toUpperCase());
            changed = true;
        }

        if (updatedPermission.getActionName() != null && !updatedPermission.getActionName().isBlank()) {
            existing.setActionName(updatedPermission.getActionName().trim().toUpperCase());
            changed = true;
        }

        if(changed) {
            // Validar duplicado
            String permissionName = existing.getModuleName() + ":" + existing.getActionName();
            if(repository.findByPermissionName(permissionName)
                    .filter(p -> !p.getSystemPermissionId().equals(existing.getSystemPermissionId()))
                    .isPresent()) {
                throw new DuplicateResourceException("El permiso ya existe: " + permissionName);
            }
        }

        return repository.save(existing);
    }
        
    @CacheEvict(value = {"permissions", "permissionsByIds"}, allEntries = true)
    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Permiso no encontrado: " + id);
        }
        repository.deleteById(id);
    }

    // Removido cache aquí para evitar problemas de conversión de tipos desde el cache store.
    public List<SystemPermissions> findAllByIds(List<Integer> ids) {
        List<SystemPermissions> permissions = repository.findAllById(ids);
        if (permissions.size() != ids.size()) {
            throw new ResourceNotFoundException("Algunos permisos no existen: " + ids);
        }
        return permissions;
    }
    
}

