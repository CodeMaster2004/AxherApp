package com.axher.backend.auth.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.axher.backend.auth.DTOs.RefreshTokenDto;
import com.axher.backend.auth.service.RefreshTokenService;
import com.axher.backend.shared.exception.InvalidRefreshTokenException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;

    //secure(true)
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {

        System.out.println("🔄 REFRESH endpoint llamado");

        if (refreshToken == null) {
            System.out.println("❌ No llegó refresh token en cookie");
            throw new InvalidRefreshTokenException("ACCESS_TOKEN_EXPIRED");
        }
         System.out.println("🍪 Refresh token recibido");

        RefreshTokenDto response = refreshTokenService.refreshAccessToken(refreshToken);
        ResponseCookie accessCookie = refreshTokenService.buildAccessCookie(response.getAccessToken());
        System.out.println("✅ Nuevo access token generado");
        ResponseCookie cookie = refreshTokenService.buildRefreshCookie(response.getRefreshToken());

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
            .body(Map.of("status", "refreshed"));
    }


}
