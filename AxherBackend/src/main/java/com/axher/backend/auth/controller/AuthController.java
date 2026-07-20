package com.axher.backend.auth.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.auth.DTOs.UserAuthResponseDto;
import com.axher.backend.auth.DTOs.UserLoginRequestDto;
import com.axher.backend.auth.DTOs.UserRegisterRequestDto;
import com.axher.backend.auth.service.AuthService;
import com.axher.backend.auth.service.RefreshTokenService;
import com.axher.backend.users.entities.Users;
import com.axher.backend.users.repositories.UsersRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final UsersRepository usersRepository;

    @PostMapping("/register")
    public ResponseEntity<UserAuthResponseDto> register(@RequestBody UserRegisterRequestDto dto){
        UserAuthResponseDto response = authService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/confirm-email")
    public ResponseEntity<UserAuthResponseDto> confirmEmail(
        @RequestParam String email,
        @RequestParam String otp
    ){
        UserAuthResponseDto response = authService.confirmEmailWithOtp(email, otp);
        ResponseCookie refreshCookie = authService.buildRefreshCookie(response.getRefreshToken());
        ResponseCookie accessCookie = authService.buildAccessCookie(response.getToken());
        return ResponseEntity.ok()
            .headers(headers -> {
                headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());
                headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
            })
            .body(response);
    
    }

    @PostMapping("/login")
    public ResponseEntity<UserAuthResponseDto> login(
        @RequestBody UserLoginRequestDto dto,
        @RequestHeader(value = "X-Forwarded-For", required = false) String ip,
        @RequestHeader(value = "User-Agent", required = false) String userAgent

    ){
        if(ip == null) ip = "unknown";
        if(userAgent == null) userAgent = "unknown";
        UserAuthResponseDto response = authService.login(dto, ip, userAgent);
        ResponseCookie refreshCookie = authService.buildRefreshCookie(response.getRefreshToken());
        ResponseCookie accessCookie = authService.buildAccessCookie(response.getToken());

        return ResponseEntity
                .ok()
                .headers(headers -> {
                    headers.add(HttpHeaders.SET_COOKIE, refreshCookie.toString());
                    headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
                })
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {

        if(refreshToken != null){
            refreshTokenService.revokeToken(refreshToken);
        }

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("lax")
                .path("/")
                .maxAge(0)
                .build();
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
            .httpOnly(true)
            .secure(false)
            .sameSite("lax")
            .path("/")
            .maxAge(0)
            .build();

        return ResponseEntity.ok()
            .headers(headers -> {
                headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
                headers.add(HttpHeaders.SET_COOKIE, accessCookie.toString());
            })
            .build();
    }

    @PostMapping("/email/resend")
    public ResponseEntity<Void> resendEmailOtp(@RequestParam String email){
        authService.resendEmailOtp(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/2fa/generate")
    public ResponseEntity<String> generateLoginOtp(@RequestParam Integer userId){
        authService.generateLoginOtp(userId);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/me")
    public ResponseEntity<UserAuthResponseDto> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Users user = (Users) authentication.getPrincipal();

        UserAuthResponseDto dto = authService.getUserAuthData(user.getUserId());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean exists = usersRepository.findByEmail(email).isPresent();
        return ResponseEntity.ok(Map.of("exists", exists));
    }
  
    
}

