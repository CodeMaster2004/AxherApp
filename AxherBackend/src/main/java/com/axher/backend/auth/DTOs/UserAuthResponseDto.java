package com.axher.backend.auth.DTOs;

import java.util.List;

import lombok.Data;

@Data
public class UserAuthResponseDto {
    private Integer userId;
    private String email;
    private List<String> roles;
    private List<String> permissions;
    private String token;
    
    private String refreshToken;
    private String provider; // GOOGLE, FACEBOOK, LOCAL, etc.
}
