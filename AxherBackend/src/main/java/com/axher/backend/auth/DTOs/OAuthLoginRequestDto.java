package com.axher.backend.auth.DTOs;

import lombok.Data;

@Data
public class OAuthLoginRequestDto {
    private String provider;
    private String idToken;
    private String preferredLanguageCode;
}
