package com.axher.backend.auth.service;

import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.axher.backend.auth.DTOs.RefreshTokenDto;
import com.axher.backend.auth.entities.RefreshToken;
import com.axher.backend.auth.repositories.RefreshTokenRepository;
import com.axher.backend.infrastructure.security.jwt.JwtService;
import com.axher.backend.shared.exception.InvalidRefreshTokenException;
import com.axher.backend.users.entities.Users;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    private final long REFRESH_TTL = 7 * 24 * 60 * 60;
    private static final int MAX_TOKENS_PER_USER = 5;

    public String createRefreshToken(Users user, String familyId) {
        System.out.println("🆕 createRefreshToken ejecutado para user: " + user.getUserId());

        String rawToken = UUID.randomUUID().toString();
        String hashedToken = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(hashedToken)
                .familyId(familyId)
                .user(user)
                .revoked(false)
                .createdAt(Instant.now())
                .expiryDate(Instant.now().plusSeconds(REFRESH_TTL))
                .build();

        refreshTokenRepository.save(refreshToken);

        limitUserTokens(user);

        return rawToken;
    }

    public void verifyExpiration(RefreshToken token) {

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new InvalidRefreshTokenException("REFRESH_TOKEN_EXPIRED");
        }

        if (token.isRevoked()) {
            throw new InvalidRefreshTokenException("REFRESH_TOKEN_REVOKED");
        }
    }

    public RefreshTokenDto refreshAccessToken(String refreshTokenValue) {
        System.out.println("🔄 REFRESH TOKEN REQUEST RECIBIDO");
        String hashedToken = hashToken(refreshTokenValue);

        RefreshToken token = refreshTokenRepository
                .findByToken(hashedToken)
                .orElseThrow(() -> new InvalidRefreshTokenException("REFRESH_TOKEN_NOT_FOUND"));
        System.out.println("📌 Token encontrado ID: " + token.getId());
        verifyExpiration(token);

        Users user = token.getUser();
        System.out.println("👤 Usuario: " + user.getUserId());
        // revocar token viejo
        token.setRevoked(true);
        refreshTokenRepository.save(token);
        System.out.println("🚫 Token anterior revocado");

        // crear refresh token nuevo
        String newRefreshToken = createRefreshToken(user, token.getFamilyId());
        System.out.println("🆕 Nuevo refresh token creado");

        // generar access token
        String accessToken = jwtService.generateAccessToken(user);

        return new RefreshTokenDto(accessToken, newRefreshToken);
    }

    public ResponseCookie buildRefreshCookie(String token) {
        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(false) // Cambia a true en producción
                .sameSite("lax") //strict
                .path("/") ///api/auth
                .maxAge(7 * 24 * 60 * 60)
                .build();
    }

    public ResponseCookie buildAccessCookie(String token) {
        return ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(false) // true en producción
                .sameSite("lax")
                .path("/")
                .maxAge(15 * 60) // 15 minutos
                .build();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing token");
        }
    }

    public void revokeToken(String refreshTokenValue){
    
        String hashedToken = hashToken(refreshTokenValue);

        RefreshToken token = refreshTokenRepository
            .findByToken(hashedToken)
            .orElseThrow(() -> new InvalidRefreshTokenException("REFRESH_TOKEN_NOT_FOUND"));

        token.setRevoked(true);

        refreshTokenRepository.save(token);
    }

    private void limitUserTokens(Users user) {

        List<RefreshToken> tokens = refreshTokenRepository
                .findByUserOrderByCreatedAtDesc(user);

        if (tokens.size() > MAX_TOKENS_PER_USER) {
            List<RefreshToken> toDelete = tokens.subList(MAX_TOKENS_PER_USER, tokens.size());
            refreshTokenRepository.deleteAll(toDelete);

            System.out.println("🧹 Tokens antiguos eliminados: " + toDelete.size());
        }
    }


    
}

