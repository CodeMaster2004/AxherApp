package com.axher.backend.auth.controller;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.auth.DTOs.OAuthLoginRequestDto;
import com.axher.backend.auth.DTOs.UserAuthResponseDto;
import com.axher.backend.auth.service.AuthService;
import com.axher.backend.auth.service.OAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;
    private final AuthService usersService;

    @PostMapping("/oauth")
    public ResponseEntity<UserAuthResponseDto> oauthLogin(@RequestBody OAuthLoginRequestDto request) {

        UserAuthResponseDto response = oAuthService.loginWithProvider(
                request.getProvider(),
                request.getIdToken(),
                request.getPreferredLanguageCode()
        );

        // Crear cookies HttpOnly
        ResponseCookie refreshCookie = usersService.buildRefreshCookie(response.getRefreshToken());
        ResponseCookie accessCookie = usersService.buildAccessCookie(response.getToken());

        return ResponseEntity.ok()
                .header("Set-Cookie", refreshCookie.toString())
                .header("Set-Cookie", accessCookie.toString())
                .body(response);
        }
    
}

