package com.axher.backend.infrastructure.seeder;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.repositories.SystemRolesRepository;
import com.axher.backend.infrastructure.security.crypto.PasswordProtection;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UsersRepository;
import com.axher.backend.users.service.UserProfilesService;
import com.axher.backend.users.service.UserRoleAssignmentsService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
@Order(1)
public class DataSeeder implements CommandLineRunner{
    private final SystemRolesRepository systemRolesRepository;
    private final UsersRepository usersRepository;
    private final UserProfilesService userProfilesService;
    private final UserRoleAssignmentsService userRoleAssignmentsService;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedAdminUser();
    }

    private void seedRoles() {
        List<String> roles = List.of("ADMIN", "USER");
        
        for(String roleName : roles){
            if(!systemRolesRepository.existsByRoleName(roleName)){
                SystemRoles role = new SystemRoles();
                role.setRoleName(roleName);
                systemRolesRepository.save(role);
                System.out.println("Rol creado: " + roleName);
            }
        }
    }

    @Transactional
    private void seedAdminUser() {
        String adminEmail = "alexadmin@peliculas.com";
        if(usersRepository.findByEmail(adminEmail).isEmpty()) {
            Users admin = new Users();
            String salt = PasswordProtection.generateSalt();
            admin.setEmail(adminEmail);
            admin.setPassword(PasswordProtection.hashPassword("Admin123", salt));
            admin.setSalt(salt);
            admin.setIsConfirmed(true);

            usersRepository.save(admin);

            // Crear perfil por defecto
            userProfilesService.createProfile(admin, null);

            // Asignar rol ADMIN usando el servicio
            userRoleAssignmentsService.assignRole(admin.getUserId(), "ADMIN");

            System.out.println("Usuario admin creado: " + adminEmail);
        }
    }
    
}
