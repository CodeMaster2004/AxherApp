package com.axher.backend.infrastructure.security.config.startup;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.aop.support.AopUtils;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.authorization.entities.SystemPermissions;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.repositories.SystemPermissionsRepository;
import com.axher.backend.authorization.repositories.SystemRolesRepository;
import com.axher.backend.authorization.service.RolePermissionAssignmentsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
@Transactional
@Order(2) // Asegura que se ejecute después del DataSeeder
public class PermissionInitializer implements CommandLineRunner {

    private final ApplicationContext applicationContext;
    private final SystemPermissionsRepository permRepo;
    private final SystemRolesRepository roleRepo;
    private final RolePermissionAssignmentsService rolePermService;

    @Override
    public void run(String... args) {
        log.info("=== PermissionInitializer START ===");
        Map<String, Object> controllers = applicationContext.getBeansWithAnnotation(RestController.class);
        Set<String> permissions = new HashSet<>();

        for (Object controller : controllers.values()) {
            Class<?> targetClass = AopUtils.getTargetClass(controller);
            log.info("Escaneando controller: {}", targetClass.getSimpleName());

            for (java.lang.reflect.Method method : targetClass.getMethods()) {
                PreAuthorize pa = method.getAnnotation(PreAuthorize.class);
                if (pa != null && pa.value().contains("hasAuthority")) {
                    String perm = pa.value().split("'")[1];
                    log.info("Encontrado permiso en método {}: {}", method.getName(), perm);
                    permissions.add(perm);
                }
            }
        }

        for (String perm : permissions) {
            String[] parts = perm.split(":");
            if (parts.length != 2) {
                log.warn("Permiso ignorado por formato incorrecto: {}", perm);
                continue;
            }

            boolean exists = permRepo.existsByModuleNameAndActionName(parts[0], parts[1]);
            log.info("Revisando permiso '{}': existe en DB? {}", perm, exists);

            if (!exists) {
                SystemPermissions p = new SystemPermissions();
                p.setModuleName(parts[0]);
                p.setActionName(parts[1]);
                permRepo.save(p);
                log.info("Permiso guardado: {}", p.getPermissionName());
            } else {
                log.info("Permiso ya existe, no se guarda: {}", perm);
            }
        }

        // RoleRepository y RolePermissionService inyectados
        SystemRoles admin = roleRepo.findByRoleName("ADMIN")
            .orElseGet(() -> {
                SystemRoles r = new SystemRoles();
                r.setRoleName("ADMIN");
                return roleRepo.save(r);
            });

        List<String> currentPerms = rolePermService.getPermissionNamesByRole(admin);

        if (currentPerms.isEmpty()) {
            List<SystemPermissions> allPerms = permRepo.findAll();
            rolePermService.assignMultiplePermissions(admin, allPerms);
            log.info("Permisos iniciales asignados a ADMIN");
        } else {
            log.info("ADMIN ya tiene permisos, no se modifica");
        }
                    
    }
}