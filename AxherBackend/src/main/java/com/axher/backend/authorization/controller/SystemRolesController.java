package com.axher.backend.authorization.controller;

import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.authorization.DTOs.SystemRoleDto;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.service.SystemRolesService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class SystemRolesController {

    private final SystemRolesService service;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "systemRoleId", "roleName"
    );

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE:VIEW')") // Permiso para ver roles
    public Page<SystemRoleDto> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "systemRoleId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "systemRoleId");

        return service.findAll(PageRequest.of(page, size, sortObj), search)
            .map(role -> new SystemRoleDto(
                role.getSystemRoleId(),
                role.getRoleName()
            ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE:VIEW')") // Permiso para ver roles
    public ResponseEntity<SystemRoles> findById(@PathVariable Integer id){
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE:CREATE')") // Permiso para crear roles
    public ResponseEntity<SystemRoles> create(@Valid @RequestBody SystemRoles role){
        SystemRoles created = service.create(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE:EDIT')") // Permiso para editar roles
    public ResponseEntity<SystemRoles> update(@PathVariable Integer id,  @RequestBody SystemRoles role){
        return ResponseEntity.ok(service.update(id, role));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE:DELETE')") // Permiso para eliminar roles
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}

