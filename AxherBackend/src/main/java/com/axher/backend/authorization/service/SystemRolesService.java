package com.axher.backend.authorization.service;

import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.repositories.SystemRolesRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class SystemRolesService {
 
    private final SystemRolesRepository repository;

    public Page<SystemRoles> findAll(Pageable pageable, String search){
        
        if(search == null || search.isEmpty()){
            return repository.findAll(pageable);
        }

        return repository.findByRoleNameContainingIgnoreCase(search, pageable);
    }

    public SystemRoles findById(Integer id){
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + id));
    }

    @Transactional(readOnly = true)
    public Optional<SystemRoles> findByRoleName(String roleName) {
        return repository.findByRoleName(roleName);
    }

    @CacheEvict(value = {"roles", "rolesByName"}, allEntries = true)
    public SystemRoles create(SystemRoles role){
        String normalized = role.getRoleName().trim().toUpperCase();

        role.setRoleName(normalized);

        if(repository.existsByRoleName(normalized)){
            throw new DuplicateResourceException("El rol ya existe: " + normalized);
        }

        return repository.save(role);
    }

    @CacheEvict(value = {"roles", "rolesByName"}, allEntries = true)
    public SystemRoles update(Integer id, SystemRoles role){

        SystemRoles existing = findById(id);

        if(role.getRoleName() != null){

            if(role.getRoleName().isBlank()){
                throw new IllegalArgumentException("El nombre del rol no puede estar vacío");
            }

            String normalized = role.getRoleName().trim().toUpperCase();

            if(!normalized.equals(existing.getRoleName())
                && repository.existsByRoleName(normalized)){
                throw new DuplicateResourceException("El rol ya existe: " + normalized);
            }
            existing.setRoleName(normalized);
        }
        return repository.save(existing);
    }

    @CacheEvict(value = {"roles", "rolesByName"}, allEntries = true)
    public void delete(Integer id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Rol no encontrado: " + id);
        }
        repository.deleteById(id);
    }


}
