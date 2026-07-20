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

import com.axher.backend.authorization.entities.SystemPermissions;
import com.axher.backend.authorization.service.SystemPermissionsService;
import com.axher.backend.shared.util.SortUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/system-permissions")
@RequiredArgsConstructor
public class SystemPermissionsController {

    private final SystemPermissionsService service;

    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
        "systemPermissionId", "permissionName", "moduleName", "actionName"
    );

    @GetMapping
    @PreAuthorize("hasAuthority('SYSTEM_PERMISSION:VIEW')") // Permiso para ver permisos
    public Page<SystemPermissions> findAll(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "systemPermissionId,desc") String sort,
        @RequestParam(required = false) String search
    ){
        Sort sortObj = SortUtils.parseSort(sort, ALLOWED_SORT_FIELDS, "systemPermissionId");
        return service.findAll(PageRequest.of(page, size, sortObj), search);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('SYSTEM_PERMISSION:VIEW')") // Permiso para ver permisos
    public ResponseEntity<SystemPermissions> findById(@PathVariable Integer id){
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SYSTEM_PERMISSION:CREATE')") // Permiso para crear permisos
    public ResponseEntity<SystemPermissions> create(@Valid @RequestBody SystemPermissions permissions){
        SystemPermissions created = service.create(permissions);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('SYSTEM_PERMISSION:EDIT')") // Permiso para editar permisos
    public ResponseEntity<SystemPermissions> update(@PathVariable Integer id, @RequestBody SystemPermissions permissions){
        return ResponseEntity.ok(service.update(id, permissions));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SYSTEM_PERMISSION:DELETE')") // Permiso para eliminar permisos
    public ResponseEntity<Void> delete(@PathVariable Integer id){
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
}

