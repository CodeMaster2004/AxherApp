package com.axher.backend.auth.DTOs;

import lombok.Data;

@Data
public class UserRegisterRequestDto {
    private String email;
    private String password;
    private String confirmPassword;

    private String preferredLanguageCode;
    private Integer preferredLanguageId; // Add this field to store the preferred language ID
}
