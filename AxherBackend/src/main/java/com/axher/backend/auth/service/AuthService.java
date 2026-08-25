package com.axher.backend.auth.service;

import static com.axher.backend.infrastructure.specification.UsersSpecifications.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.axher.backend.auth.DTOs.UserAuthResponseDto;
import com.axher.backend.auth.DTOs.UserLoginRequestDto;
import com.axher.backend.auth.DTOs.UserRegisterRequestDto;
import com.axher.backend.authorization.entities.SystemRoles;
import com.axher.backend.authorization.repositories.SystemPermissionsRepository;
import com.axher.backend.authorization.service.RolePermissionAssignmentsService;
import com.axher.backend.infrastructure.email.EmailService;
import com.axher.backend.infrastructure.email.OtpService;
import com.axher.backend.infrastructure.security.crypto.PasswordProtection;
import com.axher.backend.infrastructure.security.jwt.JwtService;
import com.axher.backend.language.entities.Language;
import com.axher.backend.language.repositories.LanguageRepository;
import com.axher.backend.shared.exception.DuplicateResourceException;
import com.axher.backend.shared.exception.EmailNotConfirmedException;
import com.axher.backend.shared.exception.UnauthorizedException;
import com.axher.backend.users.DTOs.UsersListDto;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UserRoleAssignmentsRepository;
import com.axher.backend.users.repositories.UsersRepository;
import com.axher.backend.users.service.UserProfilesService;
import com.axher.backend.users.service.UserRoleAssignmentsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsersRepository usersRepository;
    private final JwtService jwtService;
    private final LoginHistoryService loginHistoryService;
    private final EmailService emailService;
    private final OtpService otpService;
    private final UserRoleAssignmentsService userRoleAssignmentsService;
    private final UserProfilesService userProfilesService;
    private final int OTP_EXPIRATION_HOURS = 72; // tiempo máximo para confirmar email
    private final int ACCOUNT_BLOCK_MINUTES = 15;
    private final RefreshTokenService refreshTokenService;
    private final UserRoleAssignmentsRepository userRoleAssignmentsRepository;
    private final RolePermissionAssignmentsService rolePermissionService;
    private final SystemPermissionsRepository permissionsRepository;
    private final LanguageRepository languageRepository;


    public Users findById(Integer userId) {
        return usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    /** REGISTRAR USUARIO **/
    public UserAuthResponseDto registerUser(UserRegisterRequestDto request) {
        if (!request.getPassword().equals(request.getConfirmPassword()))
            throw new RuntimeException("Las contraseñas no coinciden");

        validatePassword(request.getPassword());

        if (usersRepository.findByEmail(request.getEmail()).isPresent())
            throw new DuplicateResourceException("El email ya está registrado, Intenta iniciar sesión");

        String salt = PasswordProtection.generateSalt();
        String hashedPassword = PasswordProtection.hashPassword(request.getPassword(), salt);

        Users user = new Users();
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setSalt(salt);
        user.setIsConfirmed(false);
        user.setCreatedAt(LocalDateTime.now());
        if (request.getPreferredLanguageCode() != null &&
            !request.getPreferredLanguageCode().isBlank()) {

            languageRepository
                .findByCodeIgnoreCase(request.getPreferredLanguageCode().trim())
                .filter(Language::getActive)
                .ifPresent(user::setPreferredLanguage);
        }
        // Guardar fecha de expiración del OTP
        user.setOtpExpiresAt(LocalDateTime.now().plusHours(OTP_EXPIRATION_HOURS));
        usersRepository.save(user);

        String otp = otpService.generateOtp(user.getUserId().longValue(), "email");
        emailService.enviarCorreo(user.getEmail(), "Código de verificación", 
            "Tu código es: " + otp);

        return new UserAuthResponseDto() {{
            setUserId(user.getUserId());
            setEmail(user.getEmail());
            setRoles(userRoleAssignmentsRepository.findRoleNamesByUserId(user.getUserId()));
            setToken(null);
            setRefreshToken(null);
        }};
    }

    /** CONFIRMAR EMAIL CON OTP **/
    public UserAuthResponseDto confirmEmailWithOtp(String email, String otpInput) {
        Users user = usersRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar expiración
        if (user.getOtpExpiresAt() == null || user.getOtpExpiresAt().isBefore(LocalDateTime.now())) {
            usersRepository.delete(user);
            throw new RuntimeException("OTP expirado. Debes registrarte nuevamente.");
        }
        
        boolean valid = otpService.validateOtp(user.getUserId().longValue(), otpInput, "email");
        if (!valid) throw new RuntimeException("OTP inválido o expirado");

        user.setIsConfirmed(true);
        usersRepository.save(user);

        // Crear perfil por defecto
        userProfilesService.createProfile(user, null);

        // Asignar rol USER por defecto
        userRoleAssignmentsService.assignRole(user.getUserId(), "USER");

        String token = jwtService.generateAccessToken(user);
        /// ✅ Generar familyId solo si no existe
        UUID familyId = user.getCurrentFamilyId();
        if (familyId == null) {
            familyId = UUID.randomUUID();
            user.setCurrentFamilyId(familyId);
            usersRepository.save(user);
        }

        List<String> permissions = getUserPermissions(user.getUserId());

        // ✅ Crear refresh token
        String refreshToken = refreshTokenService.createRefreshToken(user, familyId);

        return new UserAuthResponseDto() {{
            setUserId(user.getUserId());
            setEmail(user.getEmail());
            setRoles(userRoleAssignmentsRepository.findRoleNamesByUserId(user.getUserId()));
            setPermissions(permissions);
            setToken(token);
            setRefreshToken(refreshToken);
            setPreferredLanguageCode(
                user.getPreferredLanguage() != null
                    ? user.getPreferredLanguage().getCode()
                    : null
            );
            
        }};
    }

    /** LOGIN **/
    public UserAuthResponseDto login(UserLoginRequestDto request, String ip, String userAgent) {
        // Crear specification dinámica para buscar por email o username
        Specification<Users> spec = loginEquals(request.getLogin());

        // Buscar usuario usando Specification
        Users user = usersRepository.findOne(spec)
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(LocalDateTime.now()))
            throw new RuntimeException("Cuenta bloqueada, contacta soporte.");

        boolean passwordOk = PasswordProtection.verifyPassword(request.getPassword(), user.getPassword(), user.getSalt());
        loginHistoryService.recordAttempt(user.getUserId(), passwordOk, ip, userAgent);

        if (!passwordOk) {
            int failed = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(failed);
            if (failed >= 5)
                user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(ACCOUNT_BLOCK_MINUTES));
            usersRepository.save(user);
            throw new UnauthorizedException("Credenciales inválidas");
        }

        if(!user.getIsConfirmed()) {
            resendEmailOtp(user.getEmail());
            throw new EmailNotConfirmedException("Debes confirmar tu email antes de iniciar sesión", user.getEmail());
        }

        user.setFailedLoginAttempts(0);
        user.setLastLogin(LocalDateTime.now());
        usersRepository.save(user);

        String token = jwtService.generateAccessToken(user);
        // ✅ Usar familyId existente
        UUID familyId = user.getCurrentFamilyId();
        if (familyId == null) {
            familyId = UUID.randomUUID();
            user.setCurrentFamilyId(familyId);
            usersRepository.save(user);
        }

        // 2. Crear refresh token usando RefreshTokenService
        String refreshToken = refreshTokenService.createRefreshToken(user, familyId);
        List<String> permissions = getUserPermissions(user.getUserId());

        return new UserAuthResponseDto() {{
            setUserId(user.getUserId());
            setEmail(user.getEmail());
            setRoles(userRoleAssignmentsRepository.findRoleNamesByUserId(user.getUserId()));
            setPermissions(permissions);
            setToken(token);
            setRefreshToken(refreshToken);
            setPreferredLanguageCode(
                user.getPreferredLanguage() != null
                    ? user.getPreferredLanguage().getCode()
                    : null
            );
        }};
    }
    
    /** 2FA LOGIN OTP **/
    public String generateLoginOtp(Integer userId) {
        Users user = usersRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String otp = otpService.generateOtp(user.getUserId().longValue(), "login");
        emailService.enviarCorreo(user.getEmail(), "Código de verificación", 
            "Tu código de login es: " + otp);
        return otp;
    }

    /** LISTADO DE USUARIOS PARA ADMIN **/
    public Page<UsersListDto> listUsers(String search, int page, int size) {
        Specification<Users> spec = Specification.where(isConfirmed());

        if (search != null && !search.isBlank()) {
            spec = spec.and(
                Specification.where(emailLike(search))
                            .or(usernameLike(search))
            );
        }

        Pageable pageable = PageRequest.of(page, size);

        return usersRepository.findAll(spec, pageable)
            .map(user -> {
                UsersListDto dto = new UsersListDto();
                dto.userId = user.getUserId();
                dto.email = user.getEmail();
                dto.username = user.getProfile() != null ? user.getProfile().getUsername() : null;
                dto.isConfirmed = user.getIsConfirmed();
                dto.createdAt = user.getCreatedAt();
                dto.lastLogin = user.getLastLogin();
                dto.roles = userRoleAssignmentsRepository.findRoleNamesByUserId(user.getUserId());
                return dto;
            });
    }

    public ResponseCookie buildRefreshCookie(String refreshToken){
        return refreshTokenService.buildRefreshCookie(refreshToken);
    }

    public ResponseCookie buildAccessCookie(String accessToken){
        return refreshTokenService.buildAccessCookie(accessToken);
    }

    public void resendEmailOtp(String email) {

        Users user = usersRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String otp = otpService.resendOtp(user.getUserId().longValue(), "email");

        emailService.enviarCorreo(
            user.getEmail(),
            "Código de verificación",
            "Tu nuevo código es: " + otp
        );
    }

    // Devuelve el userId extraído del accessToken (o null si inválido) 2 ultimos metodos nuevos
    public Integer getUserIdFromToken(String token) {
        try {
            if (!jwtService.validateToken(token)) return null;
            return jwtService.getUserIdFromToken(token);
        } catch (Exception e) {
            return null;
        }
    }

    private List<String> getUserPermissions(Integer userId) {
        List<SystemRoles> roles = userRoleAssignmentsRepository.findRolesByUserId(userId);
        return roles.stream()
            .flatMap(role -> rolePermissionService.getPermissionNamesByRole(role).stream())
            .distinct()
            .toList();
    }

    // Devuelve los datos del usuario autenticado para /me
    public UserAuthResponseDto getUserAuthData(Integer userId) {
        Users user = findById(userId);
        UserAuthResponseDto dto = new UserAuthResponseDto();
        dto.setUserId(user.getUserId());
        dto.setEmail(user.getEmail());
        dto.setRoles(userRoleAssignmentsRepository.findRoleNamesByUserId(user.getUserId()));
        dto.setPermissions(new ArrayList<>(getPermissions(user)));
        dto.setProvider(user.getProvider());
        dto.setPreferredLanguageCode(
            user.getPreferredLanguage() != null
                ? user.getPreferredLanguage().getCode()
                : null
        );
        dto.setPreferredLanguageId(
            user.getPreferredLanguage() != null
                ? user.getPreferredLanguage().getLanguageId()
                : null
        );
        dto.setToken(null); // No exponer token
        dto.setRefreshToken(null); // No exponer refresh
        return dto;
    }

    private void validatePassword(String password) {
        if(password == null || password.isBlank()){
            throw new RuntimeException("La contraseña no puede estar vacia");
        }

        if(password.length() < 6) {
            throw new RuntimeException("La contraseña debe tener al menos 6 caracteres");
        }

        if(!password.matches(".*[A-Z].*")) throw new RuntimeException("Debe contener al menos una letra mayúscula");
        if(!password.matches(".*\\d.*")) throw new RuntimeException("Debe contener al menos un número");
        if(!password.matches(".*[!@#%^&*()].*")) throw new RuntimeException("Debe contener al menos un carácter especial");
    }

    public Set<String> getPermissions(Users user) {
        return permissionsRepository.findPermissionsByUser(user);
    }
    
    

    
}
