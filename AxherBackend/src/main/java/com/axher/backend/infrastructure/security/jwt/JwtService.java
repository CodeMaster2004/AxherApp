package com.axher.backend.infrastructure.security.jwt;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.axher.backend.users.entities.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-ttl}")
    private long ACCESS_TTL;

    @Value("${jwt.refresh-ttl}")
    private long REFRESH_TTL;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /** GENERAR ACCESS TOKEN **/
    public String generateAccessToken(Users user) {
        return Jwts.builder()
            .subject(user.getUserId().toString())
            .claim("email", user.getEmail())
            .claim("roles", user.getSystemRoles().stream()
                .map(r -> r.getRole().getRoleName())
                .collect(Collectors.toList()))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + ACCESS_TTL))
            .signWith(getKey()) // HS256 inferred from SecretKey
                .compact();
    }

    /** GENERAR REFRESH TOKEN **/
    public String generateRefreshToken(Users user) {
        return Jwts.builder()
            .subject(user.getUserId().toString())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + REFRESH_TTL))
            .signWith(getKey())
                .compact();
    }

    /** VALIDAR TOKEN **/
    public boolean validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    /** EXTRAER CLAIMS DEL TOKEN **/
    public Claims getClaims(String token) {
        return Jwts.parser()
            .verifyWith(getKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    /** RENOVAR ACCESS TOKEN usando Refresh Token **/
    public String refreshAccessToken(String refreshToken, Users user) {
        if (!validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token inválido o expirado");
        }
        return generateAccessToken(user);
    }

    /** EXTRAER USER ID DEL TOKEN **/
    public Integer getUserIdFromToken(String token) {
        Claims claims = getClaims(token);
        return Integer.parseInt(claims.getSubject());
    }

    /** EXTRAER ROLES DEL TOKEN **/
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        Claims claims = getClaims(token);
        return (List<String>) claims.get("roles");
    }
}
