package com.axher.backend.auth.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.axher.backend.auth.DTOs.GoogleUserDto;
import com.axher.backend.auth.DTOs.UserAuthResponseDto;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.service.RolePermissionAssignmentsService;
import com.axher.backend.infrastructure.security.jwt.JwtService;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UserRoleAssignmentsRepository;
import com.axher.backend.users.repositories.UsersRepository;
import com.axher.backend.users.service.UserProfilesService;
import com.axher.backend.users.service.UserRoleAssignmentsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final UsersRepository usersRepository;
    private final UserRoleAssignmentsService userRoleAssignmentsService;
    private final JwtService jwtService;
    private final UserProfilesService userProfilesService;
    private final GoogleService googleService;
    private final RefreshTokenService refreshTokenService;
    private final UserRoleAssignmentsRepository userRoleAssignmentsRepository;
    private final RolePermissionAssignmentsService rolePermissionService;

    private final String DEFAULT_ROLE = "USER";

    public UserAuthResponseDto loginOrRegister(String email, String provider, String providerUserId, GoogleUserDto userInfo) {

        //Buscar usuario por providerUserId
        Users user = usersRepository.findByProviderUserId(providerUserId).orElse(null);

        if( user == null) {
            // Si no existe, buscar por email
            user = usersRepository.findByEmail(email).orElse(null);

            if(user != null){
                //asociar cuenta existente con provider
                user.setProvider(provider);
                user.setProviderUserId(providerUserId);
                usersRepository.save(user);
            }else {

                //Crear usuario nuevo
                Users newUser = new Users();
                newUser.setEmail(email);
                newUser.setProvider(provider);
                newUser.setProviderUserId(providerUserId);
                newUser.setIsConfirmed(true);
                newUser.setCreatedAt(LocalDateTime.now());
                newUser = usersRepository.save(newUser);

                // Crear perfil por defecto
                 userProfilesService.createProfile(newUser, userInfo);

                // Asignar rol por defecto
                userRoleAssignmentsService.assignRole(newUser.getUserId(), DEFAULT_ROLE);

                user = newUser;
            }
            
        }
        return buildAuthResponse(user);
    }

    // Login con cualquier provider (Google, Facebook, etc)
    public UserAuthResponseDto loginWithProvider(String provider, String idToken) {

        String email;
        String providerUserId;
        GoogleUserDto userInfo;

        switch (provider.toUpperCase()) {

            case "GOOGLE":
                userInfo = googleService.verifyToken(idToken);
                email = userInfo.getEmail();
                providerUserId = userInfo.getGoogleId();
                break;

            /*case "FACEBOOK":
                FacebookUser fbUser = facebookService.verifyToken(idToken);
                email = fbUser.getEmail();
                providerUserId = fbUser.getFacebookId();
                break;*/

            default:
                throw new RuntimeException("Provider no soportado");
        }

        return loginOrRegister(email, provider, providerUserId, userInfo);
    } 
    
    private UserAuthResponseDto buildAuthResponse(Users user){
        // Genera acces token
        String token = jwtService.generateAccessToken(user);

        //GEnera familyId si no existe
        String familyId = user.getCurrentFamilyId();
        if(familyId == null){
            familyId = UUID.randomUUID().toString();
            user.setCurrentFamilyId(familyId);
            usersRepository.save(user);
        }

        List<String> permissions = getUserPermissions(user.getUserId());

        // Crear refresh token
        String refreshToken = refreshTokenService.createRefreshToken(user, familyId);

        // Construir respuesta
        UserAuthResponseDto response = new UserAuthResponseDto();
        response.setUserId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setRoles(user.getSystemRoles().stream()
            .map(r -> r.getRole().getRoleName())
            .toList());
        response.setPermissions(permissions);
        response.setToken(token);
        response.setRefreshToken(refreshToken);
        response.setProvider(user.getProvider());
        return response;
    }

    private List<String> getUserPermissions(Integer userId) {
        List<SystemRoles> roles = userRoleAssignmentsRepository.findRolesByUserId(userId);
        return roles.stream()
            .flatMap(role -> rolePermissionService.getPermissionNamesByRole(role).stream())
            .distinct()
            .toList();
    }
    
}

